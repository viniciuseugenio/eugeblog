import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth-context.jsx";
import { addBookmark, removeBookmark } from "../../utils/http";

export default function BookmarkButtons({ initialIsBookmarked, postId }) {
  const { isLogged } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const navigate = useNavigate();

  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked, postId]);

  return (
    <>
      {!isBookmarked ? (
        <button
          onClick={() =>
            addBookmark(postId, isLogged, navigate, setIsBookmarked)
          }
          className="flex items-center  gap-1 text-base duration-300 hover:text-[#5b4a3e]"
        >
          <ion-icon name="bookmark-outline"></ion-icon>
          <span>Bookmark</span>
        </button>
      ) : (
        <button
          onClick={() => removeBookmark(postId, setIsBookmarked)}
          className="flex items-center  gap-1 text-base duration-300 hover:text-red-600"
        >
          <ion-icon name="bookmark"></ion-icon>
          <span>Remove bookmark</span>
        </button>
      )}
    </>
  );
}
