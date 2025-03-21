import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { deleteComment, queryClient } from "../../utils/api/";
import Modal from "../Modal";

export default function CommentDeleteButton({ commentId, buttonStyle }) {
  const { id: postId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteComment,
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments", +postId] });
      const previousComments = queryClient.getQueryData(["comments", +postId]);

      setIsOpen(false);

      // Use timeout so the modal doesn't disappear immediately
      const TIMEOUT_DURATION = 300;
      setTimeout(() => {
        queryClient.setQueryData(["comments", +postId], (oldData) => {
          return oldData.filter((item) => item.id !== commentId);
        });
      }, TIMEOUT_DURATION);

      return {
        previousComments,
        postId: +postId,
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
            title="Delete Comment"
            description="Are you sure you want to delete this comment? This action cannot be undone."
            onConfirm={() => mutate(commentId)}
            onCancel={() => setIsOpen(false)}
            confirmText="Delete"
            cancelText="Cancel"
            Icon={Trash2}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsOpen(true);
        }}
        disabled={isPending}
        className={buttonStyle}
      >
        <span>Delete</span>
      </button>
    </>
  );
}
