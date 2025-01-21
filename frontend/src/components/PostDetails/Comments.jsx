import { CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { useAuthContext } from "../../store/auth-context.jsx";
import { createComment, queryClient } from "../../utils/http";
import Comment from "./Comment";
import CommentsCount from "./CommentsCount.jsx";
import TextArea from "./TextArea.jsx";

export default function Comments({ data }) {
  const params = useParams();
  const postId = params.id;
  const { isLogged } = useAuthContext();

  const { mutate, isPending: commentIsPending } = useMutation({
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

  let inputArea;

  if (isLogged) {
    inputArea = (
      <form onSubmit={handleCommentCreation} method="post">
        <TextArea />
      </form>
    );
  } else {
    inputArea = (
      <p className="mb-6">
        Any thoughts on this?{" "}
        <Link
          className="text-primary font-bold underline"
          to={`/login?next=/post/${postId}`}
        >
          Log in
        </Link>{" "}
        and come here to share them!
      </p>
    );
  }

  return (
    <>
      {data && (
        <>
          <CommentsCount qty={data.length} postId={postId} />

          {commentIsPending ? (
            <div className="mb-3">
              <CircularProgress />
            </div>
          ) : (
            <>{inputArea}</>
          )}
          <div className="flex flex-col gap-6">
            {data.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
