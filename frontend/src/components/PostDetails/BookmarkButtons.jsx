import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function BookmarkButtons({
  initialIsBookmarked,
  isAuthenticated,
  postId,
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const navigate = useNavigate();

  async function addBookmark() {
    if (!isAuthenticated) {
      toast.info("You need to login to bookmark the post.");
      return navigate(`/login?next=/post/${postId}`);
    }

    try {
      const response = await fetch(
        `http://localhost:8000/bookmarks/api/create/${postId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Something went wrong while bookmarking the post.",
        );
        return;
      }

      toast.success(data.message);
      setIsBookmarked(true);
    } catch {
      toast.error("An unexpected error occurred. Please, try again.");
    }
  }

  async function removeBookmark() {
    try {
      const response = await fetch(
        `http://localhost:8000/bookmarks/api/delete/${postId}`,
        {
          method: "delete",
          credentials: "include",
        },
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Something went wrong while removing the bookmark.",
        );
        return;
      }

      toast.warning(data.message);
      setIsBookmarked(false);
    } catch (err) {
      console.log(err);
      toast.error("An unexpected error occurred. Please, try again.");
    }
  }

  return (
    <>
      {!isBookmarked ? (
        <button
          onClick={addBookmark}
          className="flex items-center  gap-1 text-base duration-300 hover:text-[#5b4a3e]"
        >
          <ion-icon name="bookmark-outline"></ion-icon>
          <span>Bookmark</span>
        </button>
      ) : (
        <button
          onClick={removeBookmark}
          className="flex items-center  gap-1 text-base duration-300 hover:text-[#5b4a3e]"
        >
          <ion-icon name="bookmark"></ion-icon>
          <span>Remove bookmark</span>
        </button>
      )}
    </>
  );
}
