import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthRedirect } from "../../utils/hooks";
import { removeBookmark } from "../../utils/http";

export default function RemoveBookmarkBtn({ postId, setIsBookmarked }) {
  useAuthRedirect(
    "You have to be logged to remove a bookmark.",
    `/login?next=/post/${postId}`,
  );

  const { mutate } = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      toast.success("Post was successfully removed from bookmarks.");
      setIsBookmarked(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <button
      onClick={() => mutate(postId)}
      className="flex items-center  gap-1 text-base duration-300 hover:text-red-600"
    >
      <ion-icon name="bookmark"></ion-icon>
      <span>Remove bookmark</span>
    </button>
  );
}
