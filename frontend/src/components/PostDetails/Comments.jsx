import { CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../store/auth-context.jsx";
import Comment from "./Comment";
import CommentsCount from "./CommentsCount.jsx";
import TextArea from "./TextArea.jsx";
import { toast } from "sonner";
import { loadComments, createComment, queryClient } from "../../utils/http";

export default function Comments() {
  const params = useParams();
  const postId = params.id;
  const { isLogged } = useAuth();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => loadComments(postId),
  });

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

  return (
    <>
      {isError && (
        <div className="flex items-center justify-center gap-1">
          <span className="flex items-center justify-center text-xl text-red-500">
            <ion-icon name="alert-circle-outline"></ion-icon>
          </span>
          <h3>
            {error.message || "Failed to load comments. Please, try again."}
          </h3>
        </div>
      )}

      {isPending && (
        <>
          <CommentsCount qty={0} postId={postId} />
          <div className="text-center">
            <CircularProgress />
          </div>
        </>
      )}

      {data && (
        <>
          <CommentsCount qty={data.length} postId={postId} />

          {commentIsPending ? (
            <div className="mb-3">
              <CircularProgress />
            </div>
          ) : (
            <>
              {isLogged ? (
                <form onSubmit={handleCommentCreation} method="post">
                  <TextArea />
                </form>
              ) : (
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
              )}
            </>
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
