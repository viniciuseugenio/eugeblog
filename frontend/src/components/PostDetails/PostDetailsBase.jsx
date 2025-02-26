import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
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

  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchFn(params.id),
  });

  if (isError) {
    throw new Error(error.message);
  }

  const isReviewer = data?.is_reviewer;

  const reviewToast = useRef({
    shown: false,
    postId: params.id,
  });

  useEffect(() => {
    if (
      isReview &&
      isReviewer &&
      (!reviewToast.current.shown || reviewToast.current.postId != params.id)
    ) {
      toast.warning("You are reviewing a post.", {
        description: "Make sure all edits and decisions are intentional.",
        position: "top-center",
        closeButton: false,
      });
      reviewToast.current.shown = true;
      reviewToast.current.postId = params.id;
    }
  }, [isReview, params.id, isReviewer]);

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
          {isPending ? (
            <CircularProgress size="3rem" color="#493628" />
          ) : (
            data && <PostDetails post={data.post} />
          )}
        </div>
      </div>
    </PostDetailsContext.Provider>
  );
}
