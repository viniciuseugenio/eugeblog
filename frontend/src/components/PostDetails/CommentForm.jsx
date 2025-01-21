import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "sonner";
import { createComment, queryClient } from "../../utils/http";
import TextArea from "./TextArea";

export default function CommentForm() {
  const params = useParams();
  const postId = params.id;

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comment posted successfully.");
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "An unexpected error occurred while creating your comment. Try again later.",
      );
    },
  });

  function handleCommentCreation(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const content = data.get("content");

    if (content.trim().length === 0) {
      toast.error("Comment cannot be left empty.");
      return;
    }

    mutate({ content, postId });
  }
  return (
    <form onSubmit={handleCommentCreation} method="post">
      <TextArea isPending={isPending} isSuccess={isSuccess} />
    </form>
  );
}
