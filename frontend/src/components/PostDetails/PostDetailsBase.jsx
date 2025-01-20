import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useAuthCheck } from "../../utils/hooks.js";
import PostDetails from "./PostDetails.jsx";

export const PostDetailsContext = createContext({
  isReview: null,
  postId: null,
  isOwner: null,
  isPostReviewer: null,
  isBookmarked: null,
});

export default function PostDetailsBase({ queryKey, fetchFn, isReview }) {
  // Check if user is authenticated
  useAuthCheck();

  const navigate = useNavigate();
  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchFn(params.id),
  });

  if (isError) {
    throw new Error(error.message);
  }

  const contextValue = useMemo(
    () => ({
      isReview,
      postId: data?.post.id,
      isOwner: data?.is_owner,
      isReviewer: data?.is_reviewer,
      isBookmarked: data?.is_bookmarked,
    }),
    [isReview, data],
  );

  return (
    <PostDetailsContext.Provider value={contextValue}>
      <div className="flex flex-grow flex-col items-center justify-center py-24">
        <div className="max-w-[52rem]">
          {isPending && <CircularProgress size="3rem" color="#493628" />}
          {data && <PostDetails post={data.post} />}
        </div>
      </div>
    </PostDetailsContext.Provider>
  );
}
