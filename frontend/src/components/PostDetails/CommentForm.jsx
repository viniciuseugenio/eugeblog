import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { useAuthContext } from "../../store/auth-context.jsx";
import { createComment, queryClient } from "../../utils/api/index.js";
import PrimaryButton from "../PrimaryButton.jsx";
import CommentInput from "./CommentInput";

export default function CommentForm() {
  const { id: postId } = useParams();
  const { isLogged } = useAuthContext();
  const [value, setValue] = useState();

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      if (!data.detail) {
        data.content.map((error) => toast.error(error));
        document.getElementById("comment_content").focus();
        return;
      }

      setValue("");
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
        <div className="group/div">
          <CommentInput setValue={setValue} value={value} />

          <div className="mb-6 flex justify-end">
            <div
              className={`${isPending ? "visible scale-100 opacity-100" : "invisible scale-90 opacity-0"} flex origin-center transform gap-3 duration-300 ease-in-out group-focus-within/div:visible group-focus-within/div:scale-100 group-focus-within/div:opacity-100`}
            >
              <button
                type="reset"
                onClick={() => {
                  setValue("");
                  document.activeElement.blur();
                }}
                className="active:bg-accent bg-accent/50 hover:bg-accent/70 ring-primary/30 hover:ring-primary/60 active:ring-primary/90 rounded-lg px-4 py-1 ring-1 duration-300 active:scale-95"
                disabled={isPending}
              >
                Cancel
              </button>
              <PrimaryButton
                text="Comment"
                type="submit"
                isPending={isPending}
                className="px-6 active:scale-90"
              />
            </div>
          </div>
        </div>
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
