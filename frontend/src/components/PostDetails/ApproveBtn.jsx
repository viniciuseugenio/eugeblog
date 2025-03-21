import { useMutation } from "@tanstack/react-query";
import { CircleCheckBig } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { acceptPostReview, queryClient } from "../../utils/api";
import { invalidatePostListQueries } from "../../utils/query";
import Modal from "../Modal";
import { PostDetailsContext } from "./PostDetailsBase";

export default function ApproveBtn({ buttonClasses }) {
  const { postId } = useContext(PostDetailsContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: acceptPostReview,
    onSuccess: () => {
      toast.success("This post was successfully approved.");

      // Remove the post details from the pending cache, since it is now published
      queryClient.removeQueries(["pendingPosts", postId]);

      // Invalidate the pending and published lists to ensure the post is removed
      invalidatePostListQueries();

      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Approve Post"
            description="This post will be to the public after approval. Do you want to continue? visible visible"
            cancelText="Review Again"
            confirmText="Approve"
            variant="success"
            onConfirm={() => mutate(postId)}
            onCancel={() => setIsOpen(false)}
            Icon={CircleCheckBig}
          >
            Please review all post content before approving it. We wouldn&apos;t
            want our users reading inappropriate content.
          </Modal>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(true)}
        className={`${buttonClasses} text-green-800 shadow-lg ring-1 ring-green-300 hover:bg-green-200 hover:ring-green-300 active:bg-green-300`}
      >
        <CircleCheckBig size={14} />
        <span>Approve</span>
      </button>
    </>
  );
}
