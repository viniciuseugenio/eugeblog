import { addBookmark } from "../../utils/http";
import BookmarkBtn from "./BookmarkBtn";
import { toast } from "sonner";

export default function AddBookmarkBtn({ postId, setIsBookmarked }) {
  return (
    <BookmarkBtn
      postId={postId}
      mutationFn={addBookmark}
      successToast={() => toast.success("This post is now bookmarked!")}
      setIsBookmarked={() => setIsBookmarked(true)}
      authMessage="You have to be logged to bookmark a post."
      icon="bookmark-outline"
      text="Bookmark"
    />
  );
}
