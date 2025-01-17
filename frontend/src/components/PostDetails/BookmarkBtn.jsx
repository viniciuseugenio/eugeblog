import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthCheck } from "../../utils/hooks";
import Tooltip from "../Tooltip";

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
    <div className="group relative flex items-center justify-center">
      <button
        onClick={handleClick}
        className="flex items-center gap-1 rounded-full text-xl duration-300  ease-out hover:scale-125 hover:text-[#5b4a3e]"
        aria-label="Bookmark"
      >
        <ion-icon name={icon}></ion-icon>
      </button>

      <Tooltip text={text} topPosition="-top-11" />
    </div>
  );
}
