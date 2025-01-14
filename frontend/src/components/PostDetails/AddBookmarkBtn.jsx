import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthRedirect } from "../../utils/hooks";
import { addBookmark } from "../../utils/http";

export default function AddBookmarkBtn({ postId, setIsBookmarked }) {
  useAuthRedirect(
    "You have to be logged to bookmark a post.",
    `/login?next=/post/${postId}`,
  );

  const { mutate } = useMutation({
    mutationFn: addBookmark,
    onSuccess: () => {
      toast.success("Post was successfully bookmarked.");
      setIsBookmarked(true);
    },
    onError: (error) => {
      toast.error(error.message, { id: "bookmark-error" });
    },
  });

  return (
    <button
      onClick={() => mutate(postId)}
      className="flex items-center  gap-1 text-base duration-300 hover:text-[#5b4a3e]"
    >
      <ion-icon name="bookmark-outline"></ion-icon>
      <span>Bookmark</span>
    </button>
  );
}
