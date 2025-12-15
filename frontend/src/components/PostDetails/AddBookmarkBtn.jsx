import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { createBookmark } from "../../utils/api";
import BookmarkBtn from "./BookmarkBtn";

export default function AddBookmarkBtn({ postId, setIsBookmarked }) {
  return (
    <BookmarkBtn
      postId={postId}
      successToast={() => toast.success("This post is now bookmarked!")}
      setIsBookmarked={() => setIsBookmarked(true)}
      authMessage="You have to be logged to bookmark a post."
      mutationFn={createBookmark}
      label="Save"
      icon=<Bookmark className="h-5 w-5" />
    />
  );
}
