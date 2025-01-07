import { useMutation } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { acceptPostReview, queryClient } from "../../utils/http";
import Modal from "../Modal";
import { PostDetailsContext } from "./PostDetailsBase";

export default function ApproveBtn({ buttonClasses }) {
  const { postId } = useContext(PostDetailsContext);
  const modal = useRef();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: acceptPostReview,
    onSuccess: () => {
      toast.success("This post was successfully approved.", {
        id: "approve-success",
      });
      queryClient.invalidateQueries(["posts"]);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "approve-error",
      });
    },
  });

  return (
    <>
      <Modal
        ref={modal}
        title="This post will be published!"
        mutateFn={() => mutate(postId)}
        icon="checkmark-circle-outline"
        iconColor="text-green-800"
        confirmBtnClasses="ring-300 bg-green-200 text-green-950 shadow-md ring-1 hover:bg-green-300"
      >
        Please review all post content before approving it. We wouldn&apos;t
        want our users reading inappropriate content.
      </Modal>

      <button
        onClick={() => modal.current.showModal()}
        className={`${buttonClasses} text-green-800 shadow-lg ring-1 ring-green-200 hover:bg-green-200 hover:ring-green-300`}
      >
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        <span>Approve</span>
      </button>
    </>
  );
}
