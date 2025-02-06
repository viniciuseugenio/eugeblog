import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PostFormBase from "../components/PostForm/PostFormBase";
import { editPost, loadPost, queryClient } from "../utils/http";
import { invalidatePostListQueries } from "../utils/query";

export default function PostEditPage() {
  const params = useParams();
  const navigate = useNavigate();
  const postId = params.id;

  const { data } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => loadPost(postId),
  });

  const {
    mutate,
    isPending,
    data: mutationData,
  } = useMutation({
    mutationFn: editPost,
    onSuccess: (successData) => {
      if (successData.errors) {
        toast.error(
          "There was an error with your submission. Check all the fields.",
          {
            id: "edit-error",
          },
        );
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
      toast.error(error.message, { id: "edit-error" });
    },
  });

  return (
    <PostFormBase
      queryData={data}
      mutationData={mutationData}
      postId={postId}
      isPending={isPending}
      mutate={mutate}
      title="Looks like you want to get your post even better!"
      description="The data is all loaded. You just have to change it and submit so we can see your changes and approve your post again."
    />
  );
}
