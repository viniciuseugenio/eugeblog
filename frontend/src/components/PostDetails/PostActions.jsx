import BookmarkButtons from "./BookmarkButtons";

export default function PostActions({
  canModify,
  postId,
  initialIsBookmarked,
}) {
  return (
    <div className="mb-12 flex justify-between">
      <BookmarkButtons
        initialIsBookmarked={initialIsBookmarked}
        postId={postId}
      />
      {canModify && (
        <div className="flex gap-3">
          <button className="text-light flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-1 duration-300 hover:bg-blue-700">
            <ion-icon name="create-outline"></ion-icon>
            <span>Edit</span>
          </button>
          <button className="text-light flex items-center justify-center gap-1 rounded-lg bg-red-500 px-4 py-1 duration-300 hover:bg-red-600">
            <ion-icon name="trash-outline"></ion-icon>
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
