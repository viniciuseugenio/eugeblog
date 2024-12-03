import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../store/auth-context";
import PostDetailsBase from "../components/PostDetails/PostDetailsBase.jsx";
import { CircularProgress } from "@mui/material";
import { loadPost } from "../utils/http.js";
import BaseError from "../components/BaseError.jsx";

export default function PostDetailsPage() {
  const params = useParams();
  const { login, logout, isLogged } = useAuth();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => loadPost(params.id),
  });

  if (error) {
    console.log(error.message);
  }

  useEffect(() => {
    if (data) {
      if (!data.authenticated && isLogged) {
        logout();
      }

      if (data.authenticated && !isLogged) {
        login();
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
