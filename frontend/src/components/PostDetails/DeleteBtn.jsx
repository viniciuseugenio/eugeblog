import { useMutation } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { deletePost, queryClient } from "../../utils/api";
import { invalidatePostListQueries } from "../../utils/query";
import Modal from "../Modal";
import { PostDetailsContext } from "./PostDetailsBase";
import { Trash2 } from "lucide-react";

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

      // Invalidate the pending and published lists to ensure the post is removed
      invalidatePostListQueries();

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
        mutateFn={() => mutate(postId)}
      >
        This action is irreversible. After deletion, you will not be able to
        recover the post.
      </Modal>

      <button
        onClick={() => modal.current.showModal()}
        className={`${buttonClasses} text-red-800 ring-1 ring-red-300 hover:bg-red-200 active:bg-red-300`}
      >
        <Trash2 size={14} />
        <span>Delete</span>
      </button>
    </>
  );
}
