import { useMutation } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { PostDetailsContext } from "./PostDetailsBase";
import { acceptPostReview } from "../../utils/http";
import Modal from "../Modal";
import BaseModalButtons from "../BaseModalButtons";

export default function ApproveBtn({
  handleSuccess,
  handleError,
  buttonClasses,
}) {
  const { postId } = useContext(PostDetailsContext);
  const modal = useRef();

  const handleApproval = () => {
    modal.current.showModal();
  };

  const { mutate } = useMutation({
    mutationFn: acceptPostReview,
    onSuccess: () =>
      handleSuccess("This post was accepted and published successfully."),
    onError: handleError,
  });

  return (
    <>
      <Modal
        ref={modal}
        title="This post will be published!"
        actionButtons={
          <BaseModalButtons
            confirmColor="text-light bg-green-800"
            onClick={() => mutate(postId)}
          />
        }
        icon="checkmark-circle-outline"
        iconColor="text-green-800"
      >
        Please review all post content before approving it. We wouldn&apos;t
        want our users reading inappropriate content.
      </Modal>

      <button
        onClick={handleApproval}
        className={`${buttonClasses} text-green-800 shadow-lg ring-1 ring-green-200 hover:bg-green-200 hover:ring-green-300`}
      >
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        <span>Approve</span>
      </button>
    </>
  );
}
