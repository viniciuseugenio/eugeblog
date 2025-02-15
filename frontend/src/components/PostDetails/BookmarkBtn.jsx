import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthCheck } from "../../utils/hooks";

export default function BookmarkBtn({
  postId,
  mutationFn,
  successToast,
  setIsBookmarked,
  authMessage,
  label,
  Icon,
}) {
  const { data: authData } = useAuthCheck();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      successToast();
      setIsBookmarked();
    },
    onError: (error) => {
      toast.error(error.message, { id: "bookmark-error" });
    },
  });

  function handleClick() {
    if (!authData.isAuthenticated) {
      toast.error(authMessage);
      return navigate(`/login?next=/post/${postId}`);
    }

    mutate(postId);
  }

  return (
    <div className="group relative flex items-center justify-center">
      <button
        onClick={handleClick}
        className="hover:text-primary flex items-center gap-1 rounded-md px-2 py-1 text-base duration-300 ease-out hover:bg-stone-200"
        aria-label="Bookmark"
      >
        <Icon size={20} />
        {label}
      </button>
    </div>
  );
}
