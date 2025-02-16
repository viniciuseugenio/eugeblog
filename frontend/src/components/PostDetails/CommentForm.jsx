import { useMutation } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { useAuthContext } from "../../store/auth-context.jsx";
import { createComment, queryClient } from "../../utils/http";
import CommentInput from "./CommentInput";

export default function CommentForm() {
  const { id: postId } = useParams();
  const { isLogged } = useAuthContext();

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

  if (isLogged) {
    return (
      <form onSubmit={handleCommentCreation} method="post">
        <CommentInput isPending={isPending} isSuccess={isSuccess} />
      </form>
    );
  } else {
    return (
      <p className="mb-6">
        Any thoughts on this?&nbsp;
        <Link
          className="text-primary font-bold underline"
          to={`/login?next=/post/${postId}`}
          aria-label="Log in to share your thoughts on this post"
        >
          Log in
        </Link>
        &nbsp;and share them with us!
      </p>
    );
  }
}
