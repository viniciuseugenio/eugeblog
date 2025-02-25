import { toast } from "sonner";
import { removeBookmark } from "../../utils/api";
import BookmarkBtn from "./BookmarkBtn";
import { Bookmark } from "lucide-react";

export default function RemoveBookmarkBtn({ postId, setIsBookmarked }) {
  return (
    <BookmarkBtn
      postId={postId}
      mutationFn={removeBookmark}
      successToast={() => toast.info("This post was removed from bookmarks.")}
      setIsBookmarked={() => setIsBookmarked(false)}
      authMessage="You have to be logged to remove a bookmark."
      icon={<Bookmark fill="#493628" />}
      label="Remove bookmark"
    />
  );
}
