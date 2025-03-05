import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { deleteComment, queryClient } from "../../utils/api/";
import Modal from "../Modal";
import { PostDetailsContext } from "./PostDetailsBase.jsx";

export default function CommentDeleteButton({ commentId, redButtonStyle }) {
  const { postId } = useContext(PostDetailsContext);
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteComment,
    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const previousComments = queryClient.getQueryData(["comments", postId]);

      setIsOpen(false);

      // Use timeout so the modal doesn't disappear immediately
      const TIMEOUT_DURATION = 300;
      setTimeout(() => {
        queryClient.setQueryData(["comments", postId], (oldData) => {
          return oldData.filter((item) => item.id !== commentId);
        });
      }, TIMEOUT_DURATION);

      return {
        previousComments,
        postId,
        TIMEOUT_DURATION,
      };
    },
    onError: (error, _, context) => {
      setTimeout(
        () => {
          queryClient.setQueryData(
            ["comments", context.postId],
            context.previousComments,
          );

          toast.error(error.message);
          console.error(error.message);
        },

        context.TIMEOUT_DURATION + 5,
      );
    },
    onSuccess: () => {
      toast.success("The comment was deleted successfully.");
    },
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
