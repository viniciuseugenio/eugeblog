import { addBookmark } from "../../utils/http";
import BookmarkBtn from "./BookmarkBtn";
import { toast } from "sonner";
import { BookmarkPlus } from "lucide-react";

export default function AddBookmarkBtn({ postId, setIsBookmarked }) {
  return (
    <BookmarkBtn
      postId={postId}
      mutationFn={addBookmark}
      successToast={() => toast.success("This post is now bookmarked!")}
      setIsBookmarked={() => setIsBookmarked(true)}
      authMessage="You have to be logged to bookmark a post."
      label="Bookmark"
      Icon={BookmarkPlus}
    />
  );
}
