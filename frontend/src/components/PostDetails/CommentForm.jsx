import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { useAuthContext } from "../../store/auth-context.jsx";
import { createComment, queryClient } from "../../utils/api/index.js";
import PrimaryButton from "../PrimaryButton.jsx";
import CommentInput from "./CommentInput";
import NeutralButton from "../NeutralButton.jsx";

export default function CommentForm() {
  const { id: postId } = useParams();
  const { isAuthenticated } = useAuthContext();
  const [value, setValue] = useState();

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      if (!data.detail) {
        data.content.map((error) => toast.error(error));
        document.getElementById("comment-content").focus();
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

  if (isAuthenticated) {
    return (
      <form onSubmit={handleCommentCreation} method="post">
        <div className="group/div">
          <CommentInput setValue={setValue} value={value} />

          <div className="mb-6 flex justify-end">
            <div
              className={`${isPending ? "visible scale-100 opacity-100" : "invisible scale-90 opacity-0"} flex origin-center transform gap-3 self-start duration-300 ease-in-out group-focus-within/div:visible group-focus-within/div:scale-100 group-focus-within/div:opacity-100`}
            >
              <NeutralButton
                type="reset"
                onClick={() => {
                  setValue("");
                  document.activeElement.blur();
                }}
                label="Cancel"
                disabled={isPending}
              />
              <PrimaryButton
                label="Comment"
                type="submit"
                isPending={isPending}
                className="self-start px-6 text-sm"
              />
            </div>
          </div>
        </div>
      </form>
    );
  } else {
    return (
      <div className="mb-8 bg-gray-50 p-4 text-center text-lg">
        <p className="mb-2">Any thoughts on this?</p>
        <Link
          className="text-primary/80 hover:text-primary font-medium duration-300"
          to={`/login?next=/post/${postId}`}
          aria-label="Log in to share your thoughts on this post"
        >
          Log in and share them with us!
        </Link>
      </div>
    );
  }
}
