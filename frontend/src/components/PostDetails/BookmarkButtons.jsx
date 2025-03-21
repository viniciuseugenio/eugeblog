import { useState, useEffect } from "react";
import { useParams } from "react-router";
import AddBookmarkBtn from "./AddBookmarkBtn.jsx";
import RemoveBookmarkBtn from "./RemoveBookmarkBtn.jsx";

export default function BookmarkButtons({ initialIsBookmarked }) {
  const { id: postId } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const Button = isBookmarked ? RemoveBookmarkBtn : AddBookmarkBtn;
  return <Button postId={postId} setIsBookmarked={setIsBookmarked} />;
}
