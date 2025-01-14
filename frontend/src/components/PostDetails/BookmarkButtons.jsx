import { useContext, useState } from "react";
import AddBookmarkBtn from "./AddBookmarkBtn.jsx";
import { PostDetailsContext } from "./PostDetailsBase.jsx";
import RemoveBookmarkBtn from "./RemoveBookmarkBtn.jsx";

export default function BookmarkButtons() {
  const { postId, isBookmarked: initialIsBookmarked } =
    useContext(PostDetailsContext);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const Button = isBookmarked ? RemoveBookmarkBtn : AddBookmarkBtn;

  return <Button postId={postId} setIsBookmarked={setIsBookmarked} />;
}
