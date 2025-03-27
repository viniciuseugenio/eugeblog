import { useMutation } from "@tanstack/react-query";
import { CircleCheckBig } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { acceptPostReview, queryClient } from "../../utils/api";
import { invalidatePostListQueries } from "../../utils/query";
import Modal from "../Modal";

export default function ApproveBtn() {
  const { id: postId } = useParams();
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
        className="flex gap-1 text-sm text-green-600 duration-300 hover:text-green-800"
      >
        <CircleCheckBig className="h-5 w-5 " />
        <span>Approve</span>
      </button>
    </>
  );
}
