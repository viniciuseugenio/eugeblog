import { useMutation } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { queryClient } from "../../utils/api/index.js";
import { updateComment } from "../../utils/api/posts/";
import { PostDetailsContext } from "./PostDetailsBase.jsx";

export default function CommentEditor({ comment, setIsEditing, actionStates }) {
  const { postId } = useContext(PostDetailsContext);
  const [commentValue, setCommentValue] = useState(comment.content);
  const textArea = useRef();

  useEffect(() => {
    textArea.current.style.height = "auto";
    textArea.current.style.height = textArea.current.scrollHeight + "px";
  }, [commentValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateComment,
    onMutate: async (comment) => {
      const postId = +comment.postId;

      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const previousComments = queryClient.getQueryData(["comments", postId]);

      queryClient.setQueryData(["comments", postId], (oldData) => {
        return oldData.map((item) =>
          item.id === comment.commentId
            ? { ...item, content: comment.content }
            : item,
        );
      });

      return { previousComments, postId };
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

    mutate({ content, postId, commentId: comment.id });
  }

  return (
    <>
      <div className="order-2">
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
      </div>

      <div
        className={`invisible row-span-2 ml-1 flex scale-0 place-self-end self-center opacity-0 duration-300 ${actionStates}`}
      >
        <div className="flex gap-1">
          <button
            disabled={isPending}
            onClick={handleSave}
            className="rounded-full p-2 text-blue-600 duration-300 hover:bg-blue-200"
            aria-label="Save changes"
          >
            <Save size={20} />
          </button>
          <button
            disabled={isPending}
            className="rounded-full p-2 text-red-500 duration-300 hover:bg-red-200 hover:text-red-800"
            onClick={() => setIsEditing(false)}
            aria-label="Cancel editing"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
