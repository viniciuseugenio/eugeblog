import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { deleteComment, queryClient } from "../../utils/api/";
import Modal from "../Modal";
import { PostDetailsContext } from "./PostDetailsBase.jsx";
import { AnimatePresence } from "motion/react";

export default function CommentDeleteButton({ commentId, redButtonStyle }) {
  const { postId } = useContext(PostDetailsContext);
  const [isOpen, setIsOpen] = useState(false);

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
    onSettled: () => setIsOpen(false),
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="This comment will be deleted."
            mutateFn={() => mutate({ postId, commentId })}
            setIsOpen={setIsOpen}
          >
            This will permanently delete the comment and the action cannot be
            undone. Confirm deletion?
          </Modal>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={redButtonStyle}
      >
        <Trash size={20} />
      </button>
    </>
  );
}
