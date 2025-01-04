import { useContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import BookmarkButtons from "./BookmarkButtons";
import { PostDetailsContext } from "./PostDetailsBase.jsx";
import DeleteBtn from "./DeleteBtn.jsx";
import { queryClient } from "../../utils/http";
import ApproveBtn from "./ApproveBtn.jsx";

export default function PostActions() {
  const navigate = useNavigate();
  const { isReview, isOwner, isReviewer } = useContext(PostDetailsContext);

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

  return (
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
            <ApproveBtn
              buttonClasses={buttonClasses}
              handleSuccess={handleSuccess}
              handleError={handleError}
            />
          )}
        </div>
      )}
    </div>
  );
}
