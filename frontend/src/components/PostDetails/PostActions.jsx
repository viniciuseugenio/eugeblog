import { Backdrop, CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { acceptPostReview } from "../../utils/http";
import BookmarkButtons from "./BookmarkButtons";
import { PostDetailsContext } from "./PostDetailsBase.jsx";
import DeleteBtn from "./DeleteBtn.jsx";
import { queryClient } from "../../utils/http";

export default function PostActions() {
  const navigate = useNavigate();
  const { isReview, isOwner, isReviewer, postId } =
    useContext(PostDetailsContext);

  const buttonClasses =
    "flex items-center justify-center gap-1 rounded-md px-4 py-1 duration-300 hover:shadow-md hover:ring-1";

  const handleSuccess = (message) => {
    toast.success(message);
    queryClient.invalidateQueries(["posts"]);
    navigate("/");
  };

  const handleError = (error) => {
    toast.error(
      error.message || "An unexpected error occurred. Try again later.",
    );
  };

  const { mutate: acceptMutate, isPending: acceptIsPending } = useMutation({
    mutationFn: acceptPostReview,
    onSuccess: () =>
      handleSuccess("This post was accepted and published successfully."),
    onError: handleError,
  });

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={acceptIsPending}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="mb-12 flex justify-between">
        {!isReview ? <BookmarkButtons /> : <div></div>}
        {(isOwner || isReviewer) && (
          <div className="flex gap-3">
            <DeleteBtn
              handleSuccess={handleSuccess}
              handleError={handleError}
              buttonClasses={buttonClasses}
            />

            <button
              className={`${buttonClasses} text-blue-800 hover:bg-blue-100 hover:ring-blue-300`}
            >
              <ion-icon name="create-outline"></ion-icon>
              <span>Edit</span>
            </button>
            {isReview && isReviewer && (
              <button
                onClick={() => acceptMutate(postId)}
                className={`${buttonClasses} text-green-800 shadow-lg ring-1 ring-green-200 hover:bg-green-200 hover:ring-green-300`}
              >
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>Approve</span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
