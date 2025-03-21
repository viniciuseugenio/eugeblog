import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { deletePost, queryClient } from "../../utils/api";
import { invalidatePostListQueries } from "../../utils/query";
import Modal from "../Modal";

export default function DeleteBtn() {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post was successfully deleted.");

      // Remove queries related to the post since it does not exist anymore
      queryClient.removeQueries({
        queryKey: ["pendingPosts", postId],
      });
      queryClient.removeQueries({
        queryKey: ["publishedPosts", postId],
      });

      // Invalidate the pending and published lists to ensure the post is removed
      invalidatePostListQueries();

      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, { id: "delete-error" });
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Delete Your Post"
            description="Are you sure you want to delete this post? This action cannot be undone."
            onConfirm={() => mutate(postId)}
            onCancel={() => setIsOpen(false)}
            confirmText="Delete"
            cancelText="Cancel"
            Icon={Trash2}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(true)}
        className=" flex gap-1 text-sm text-red-500 duration-300 hover:text-red-600"
      >
        <Trash2 className="h-5 w-5" />
        <span>Delete</span>
      </button>
    </>
  );
}
