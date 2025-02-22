import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useContext, useRef } from "react";
import { toast } from "sonner";
import { deleteComment, queryClient } from "../../utils/http/";
import Modal from "../Modal";
import { PostDetailsContext } from "./PostDetailsBase.jsx";

export default function CommentDeleteButton({ commentId }) {
  const modal = useRef();
  const { postId } = useContext(PostDetailsContext);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("The comment was deleted successfully.");
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: ({ message }) => {
      toast.error(message);
      console.error(message);
    },
    onSettled: () => modal.current.close(),
  });

  return (
    <>
      <Modal
        confirmBtnClasses="bg-red-200 text-red-950 shadow-md ring-1 ring-red-300 hover:bg-red-300 hover:ring-red-400"
        ref={modal}
        title="This comment will be deleted."
        mutateFn={() => mutate({ postId, commentId })}
      >
        This will permanently delete the comment and the action cannot be
        undone. Confirm deletion?
      </Modal>
      <button
        onClick={() => modal.current.showModal()}
        disabled={isPending}
        className="flex items-center justify-center rounded-full p-2 text-red-500 duration-300 hover:bg-red-200 hover:text-red-700 active:scale-90"
      >
        <Trash size={20} />
      </button>
    </>
  );
}
