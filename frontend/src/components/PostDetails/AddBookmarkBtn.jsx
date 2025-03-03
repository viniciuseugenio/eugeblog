import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { addBookmark } from "../../utils/api";
import BookmarkBtn from "./BookmarkBtn";

export default function AddBookmarkBtn({ postId, setIsBookmarked }) {
  return (
    <BookmarkBtn
      postId={postId}
      mutationFn={addBookmark}
      successToast={() => toast.success("This post is now bookmarked!")}
      setIsBookmarked={() => setIsBookmarked(true)}
      authMessage="You have to be logged to bookmark a post."
      label="Bookmark"
      icon=<Bookmark size={20} />
    />
  );
}
