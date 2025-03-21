import { SquarePen } from "lucide-react";
import { Link } from "react-router";
import ApproveBtn from "./ApproveBtn.jsx";
import BookmarkButtons from "./BookmarkButtons";
import DeleteBtn from "./DeleteBtn.jsx";
import { useParams } from "react-router";

export default function PostActions({
  isReview,
  isOwner,
  isReviewer,
  isBookmarked,
}) {
  const { id: postId } = useParams();

  return (
    <div className="mb-8 flex justify-between border-b pb-8">
      <div className="flex items-center gap-4">
        {(isOwner || isReviewer) && (
          <>
            <Link
              to={`/post/edit/${postId}/`}
              className="flex gap-1 text-sm text-blue-500 duration-300 hover:text-blue-700"
            >
              <SquarePen className="h-5 w-5" />
              <span>Edit</span>
            </Link>

            <DeleteBtn />

            {isReview && isReviewer && <ApproveBtn />}
          </>
        )}
      </div>

      {!isReview && (
        <BookmarkButtons key={postId} initialIsBookmarked={isBookmarked} />
      )}
    </div>
  );
}
