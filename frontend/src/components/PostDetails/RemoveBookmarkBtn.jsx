import { toast } from "sonner";
import { deleteBookmark } from "../../utils/api";
import BookmarkBtn from "./BookmarkBtn";
import { BookmarkCheck } from "lucide-react";

export default function RemoveBookmarkBtn({ postId, setIsBookmarked }) {
  return (
    <BookmarkBtn
      postId={postId}
      successToast={() => toast.info("This post was removed from bookmarks.")}
      setIsBookmarked={() => setIsBookmarked(false)}
      authMessage="You have to be logged to remove a bookmark."
      mutationFn={deleteBookmark}
      icon={<BookmarkCheck className="h-5 w-5" />}
      label="Saved"
      color="text-secondary"
    />
  );
}
