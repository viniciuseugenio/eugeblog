import { useContext } from "react";
import { Link } from "react-router";
import ApproveBtn from "./ApproveBtn.jsx";
import BookmarkButtons from "./BookmarkButtons";
import DeleteBtn from "./DeleteBtn.jsx";
import { PostDetailsContext } from "./PostDetailsBase.jsx";
import { PencilLine } from "lucide-react";

export default function PostActions() {
  const { isReview, isOwner, isReviewer, postId } =
    useContext(PostDetailsContext);

  const buttonClasses =
    "flex items-center justify-center gap-1 rounded-md px-4 py-1 duration-300 hover:shadow-md hover:ring-1";

  return (
    <div className="mb-12 flex justify-between">
      {!isReview && <BookmarkButtons key={postId} />}
      {(isOwner || isReviewer) && (
        <div className={`flex gap-3 ${isReview && "w-full justify-end"}`}>
          <DeleteBtn buttonClasses={buttonClasses} />

          <Link
            to={`/post/edit/${postId}/`}
            className={`${buttonClasses} text-blue-800 ring-1 ring-blue-300 hover:bg-blue-100 hover:ring-blue-300`}
          >
            <PencilLine size={14} />
            <span>Edit</span>
          </Link>
          {isReview && isReviewer && (
            <ApproveBtn buttonClasses={buttonClasses} />
          )}
        </div>
      )}
    </div>
  );
}
