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
  icon,
  text,
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
    <button
      onClick={handleClick}
      className="flex items-center  gap-1 text-base duration-300 hover:text-[#5b4a3e]"
    >
      <ion-icon name={icon}></ion-icon>
      <span>{text}</span>
    </button>
  );
}
