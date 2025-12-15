import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Tooltip from "../Tooltip";
import { useAuthContext } from "../../store/auth-context";

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
  const { isAuthenticated } = useAuthContext();
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
    if (!isAuthenticated) {
      toast.error("You have to be authenticated to perform this action!");
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
