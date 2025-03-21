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
  label,
  icon,
  color = "text-primary",
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
        className={`${color} flex items-center gap-1 rounded-full p-2 duration-300 ease-out`}
        aria-label={label}
      >
        {icon}
        <span className="text-sm">{label}</span>
      </button>
    </div>
  );
}
