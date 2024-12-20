import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { createContext, useEffect, useMemo } from "react";
import { useAuth } from "../../store/auth-context.jsx";
import PostDetails from "./PostDetails.jsx";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";

export const PostDetailsContext = createContext({
  isReview: null,
  postId: null,
  hasModifyPermission: null,
  isBookmarked: null,
});

function usePostDetails(queryKey, fetchFn, isReview) {
  const navigate = useNavigate();
  const params = useParams();
  const { login, logout, isLogged } = useAuth();

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchFn(params.id),
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message, { id: "details-error" });
      navigate("/");
    }
  }, [isError, error, navigate]);

  useEffect(() => {
    if (data) {
      if (!data.authenticated && isLogged) logout();
      if (data.authenticated && !isLogged) login(data.user_id);

      if (data.post?.id && isReview) {
        toast.info(
          "You are reviewing this post. Be very careful with what you do.",
          {
            id: "review-info",
            duration: 5000,
          },
        );
      }
    }
  }, [data, isLogged, login, logout, isReview]);

  return { data, isPending, isError, error };
}

export default function PostDetailsBase({ queryKey, fetchFn, isReview }) {
  const { data, isPending } = usePostDetails(queryKey, fetchFn, isReview);

  const contextValue = useMemo(
    () => ({
      isReview,
      postId: data?.post.id,
      hasModifyPermission: data?.has_modify_permission,
      isBookmarked: data?.is_bookmarked,
    }),
    [isReview, data],
  );

  return (
    <PostDetailsContext.Provider value={contextValue}>
      <div className="flex flex-col items-center py-24">
        <div className="max-w-[52rem]">
          {isPending && <CircularProgress size="3rem" color="#493628" />}
          {data && <PostDetails post={data.post} />}
        </div>
      </div>
    </PostDetailsContext.Provider>
  );
}
