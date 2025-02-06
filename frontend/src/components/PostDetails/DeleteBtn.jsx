import { useMutation } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { deletePost, queryClient } from "../../utils/http";
import Modal from "../Modal";
import { PostDetailsContext } from "./PostDetailsBase";

export default function DeleteBtn({ buttonClasses }) {
  const { postId } = useContext(PostDetailsContext);
  const modal = useRef();
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

      // Invalidate both published and pending lists to ensure the post is removed
      queryClient.invalidateQueries({
        queryKey: ["publishedPosts"],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["pendingPosts"],
        exact: true,
      });

      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, { id: "delete-error" });
    },
  });

  return (
    <>
      <Modal
        ref={modal}
        title="Are you sure of this?"
        icon="alert-circle-outline"
        iconColor="text-red-600"
        confirmBtnClasses="bg-red-200 text-red-950 shadow-md ring-1 ring-red-300 hover:bg-red-300 hover:ring-red-400"
        mutateFn={() => mutate(postId)}
      >
        This action is irreversible. After deletion, you will not be able to
        recover the post.
      </Modal>

      <button
        onClick={() => modal.current.showModal()}
        className={`${buttonClasses} text-red-800 ring-1 ring-red-300 hover:scale-105 hover:bg-red-200 hover:ring-red-300`}
      >
        <ion-icon name="trash-outline"></ion-icon>
        <span>Delete</span>
      </button>
    </>
  );
}
