import { useMutation } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { deletePost } from "../../utils/http";
import { PostDetailsContext } from "./PostDetailsBase";
import BaseModalButtons from "../BaseModalButtons";
import Modal from "../Modal";

export default function DeleteBtn({
  buttonClasses,
  handleSuccess,
  handleError,
}) {
  const { postId } = useContext(PostDetailsContext);
  const modal = useRef();

  const handleDelete = (event) => {
    event.preventDefault();
    modal.current.showModal();
  };

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => handleSuccess("This post was deleted successfully."),
    onError: handleError,
  });

  return (
    <>
      <Modal
        ref={modal}
        title="Are you sure of this?"
        icon="alert-circle-outline"
        actionButtons={<BaseModalButtons onClick={() => mutate(postId)} />}
      >
        This action is irreversible. After deletion, you will not be able to
        recover the post.
      </Modal>

      <button
        onClick={handleDelete}
        className={`${buttonClasses} text-red-600 hover:bg-red-200 hover:ring-red-300`}
      >
        <ion-icon name="trash-outline"></ion-icon>
        <span>Delete</span>
      </button>
    </>
  );
}
