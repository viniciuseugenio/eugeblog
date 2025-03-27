import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PostFormBase from "../components/PostForm/PostFormBase";
import {
  editPost,
  loadPendingAndPublishedPost,
  queryClient,
} from "../utils/api";
import { ERROR_MESSAGES } from "../utils/constants";
import { invalidatePostListQueries } from "../utils/query";

export default function PostEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const postId = params.id;

  const { data } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => loadPendingAndPublishedPost(postId),
  });

  const {
    mutate,
    isPending,
    data: mutationData,
  } = useMutation({
    mutationFn: editPost,
    onSuccess: (successData) => {
      if (successData?.id === "no-changes") {
        toast.info(successData.detail);
        const url =
          data?.post.review_status === "A"
            ? `/post/${postId}`
            : `/post/review/${postId}`;
        navigate(url);
        return;
      }

      if (successData.errors) {
        toast.error(ERROR_MESSAGES.FORM_ERROR);
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, [100]);
        return;
      }

      toast.success(successData.detail, { id: "edit-success" });

      // Remove the post from the post details cache
      queryClient.removeQueries(["publishedPosts", postId]);

      // Invalidate the pending and published lists to ensure the post is removed
      invalidatePostListQueries();

      navigate(`/post/review/${postId}`);
    },
    onError: (error) => {
      toast.error(error.message);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, [100]);
    },
  });

  return (
    <PostFormBase
      queryData={data}
      mutationData={mutationData}
      postId={postId}
      isPending={isPending}
      mutate={mutate}
      title="Edit Existing Post"
    />
  );
}
