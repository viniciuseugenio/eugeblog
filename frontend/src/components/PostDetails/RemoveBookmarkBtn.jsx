import { toast } from "sonner";
import { deleteBookmark } from "../../utils/api";
import BookmarkBtn from "./BookmarkBtn";
import { BookmarkCheck } from "lucide-react";

export default function RemoveBookmarkBtn({ postId, setIsBookmarked }) {
  return (
    <BookmarkBtn
      postId={postId}
      mutationFn={deleteBookmark}
      onSuccess={() => {
        toast.info("This post was removed from your bookmarks");
        setIsBookmarked(false);
      }}
      icon={<BookmarkCheck className="h-5 w-5" />}
      label="Saved"
      color="text-secondary"
    />
  );
}
