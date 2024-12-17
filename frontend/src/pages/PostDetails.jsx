import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../store/auth-context";
import PostDetailsBase from "../components/PostDetails/PostDetailsBase.jsx";
import { CircularProgress } from "@mui/material";
import { loadPost } from "../utils/http";
import BaseError from "../components/BaseError.jsx";
import { toast } from "sonner";

export default function PostDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { login, logout, isLogged } = useAuth();
  const hasNotifiedError = useRef(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => loadPost(params.id),
  });

  if (error) {
    if (!hasNotifiedError.current) {
      toast.error(error.message);
      hasNotifiedError.current = true;
    }
    navigate("/");
  }

  useEffect(() => {
    if (data) {
      if (!data.authenticated && isLogged) {
        logout();
      }

      if (data.authenticated && !isLogged) {
        login(data.user_id);
      }
    }
  }, [data, isLogged, login, logout]);

  return (
    <>
      <div className="flex flex-col items-center py-24">
        <div className="max-w-[52rem]">
          {isPending && <CircularProgress size="4rem" color="#493628" />}
          {isError && (
            <BaseError title="Something went wrong!">{error.message}</BaseError>
          )}
          {data && (
            <PostDetailsBase
              post={data.post}
              hasModifyPermission={data.has_modify_permission}
              isBookmarked={data.is_bookmarked}
            />
          )}
        </div>
      </div>
    </>
  );
}
