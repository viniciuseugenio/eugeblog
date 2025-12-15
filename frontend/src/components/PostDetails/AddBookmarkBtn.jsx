import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { createBookmark } from "../../utils/api";
import BookmarkBtn from "./BookmarkBtn";

export default function AddBookmarkBtn({ postId, setIsBookmarked }) {
  return (
    <BookmarkBtn
      postId={postId}
      mutationFn={createBookmark}
      onSuccess={() => {
        toast.success("This post is now bookmarked");
        setIsBookmarked(true);
      }}
      label="Save"
      icon=<Bookmark className="h-5 w-5" />
    />
  );
}
