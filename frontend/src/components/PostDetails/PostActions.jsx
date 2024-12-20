import BookmarkButtons from "./BookmarkButtons";
import { useContext } from "react";
import { PostDetailsContext } from "./PostDetailsBase.jsx";

export default function PostActions() {
  const { isReview, hasModifyPermission } = useContext(PostDetailsContext);
  const buttonClasses =
    "flex items-center justify-center gap-1 rounded-md px-4 py-1 duration-300 hover:shadow-md hover:ring-1";

  return (
    <div className="mb-12 flex justify-between">
      {!isReview ? <BookmarkButtons /> : <div></div>}
      {hasModifyPermission && (
        <div className="flex gap-3">
          <button
            className={`${buttonClasses} text-red-600 hover:bg-red-200 hover:ring-red-300`}
          >
            <ion-icon name="trash-outline"></ion-icon>
            <span>Delete</span>
          </button>
          <button
            className={`${buttonClasses} text-blue-800 hover:bg-blue-100 hover:ring-blue-300`}
          >
            <ion-icon name="create-outline"></ion-icon>
            <span>Edit</span>
          </button>
          {isReview && (
            <button
              className={`${buttonClasses} text-green-800 shadow-lg ring-1 ring-green-200 hover:bg-green-200 hover:ring-green-300`}
            >
              <ion-icon name="checkmark-circle-outline"></ion-icon>
              <span>Approve</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
