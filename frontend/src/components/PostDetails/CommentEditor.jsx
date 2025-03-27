import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { queryClient } from "../../utils/api/index.js";
import { updateComment } from "../../utils/api/posts/";
import PrimaryButton from "../PrimaryButton.jsx";

export default function CommentEditor({ comment, setIsEditing }) {
  const { id: postId } = useParams();
  const [commentValue, setCommentValue] = useState(comment.content);
  const textArea = useRef();

  useEffect(() => {
    textArea.current.style.height = "auto";
    textArea.current.style.height = textArea.current.scrollHeight + "px";
  }, [commentValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateComment,
    onMutate: async (comment) => {
      const castPostId = +postId;
      await queryClient.cancelQueries({ queryKey: ["comments", castPostId] });
      const previousComments = queryClient.getQueryData([
        "comments",
        castPostId,
      ]);

      queryClient.setQueryData(["comments", castPostId], (oldData) => {
        return oldData.map((item) =>
          item.id === comment.commentId
            ? { ...item, content: comment.content }
            : item,
        );
      });

      return { previousComments, castPostId };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        ["comments", context.postId],
        context.previousComments,
      );
      toast.error(error.message);
    },
    onSuccess: (data, _, context) => {
      if (!data.detail) {
        queryClient.setQueryData(
          ["comments", context.postId],
          context.previousComments,
        );

        data.content.forEach((error) => toast.error(error));
        return;
      }

      toast.success("Comment updated successfully");
      setIsEditing(false);
    },
  });

  function handleSave() {
    const content = textArea.current.value;

    if (content === comment.content) {
      setIsEditing(false);
      return;
    }

    mutate({ content, commentId: comment.id });
  }

  return (
    <div className="flex flex-col">
      <textarea
        ref={textArea}
        name="content"
        id="edit-comment"
        rows={1}
        placeholder="Add a comment..."
        onChange={(e) => setCommentValue(e.target.value)}
        value={commentValue}
        className="mb-2 w-full border-b border-[#AB886D] bg-inherit pb-1 text-inherit outline-none duration-300 focus:border-[#493628]"
      />

      <div className="flex items-start gap-3 self-end">
        <button
          disabled={isPending}
          onClick={() => setIsEditing(false)}
          aria-label="Cancel editing"
          className="rounded-md px-5 py-2 font-medium ring-1 ring-inset ring-neutral-300 duration-300 hover:bg-neutral-200 active:bg-neutral-300"
        >
          Cancel
        </button>

        <PrimaryButton
          onClick={handleSave}
          disabled={isPending}
          className="py-2 text-sm"
          label="Save"
        />
      </div>
    </div>
  );
}
