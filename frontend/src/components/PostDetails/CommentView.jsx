import { SquarePen } from "lucide-react";
import CommentDeleteButton from "./CommentDeleteButton";

export default function CommentView({
  comment,
  setIsEditing,
  actionStates,
  isAuthor,
  blueButtonStyle,
  redButtonStyle,
}) {
  function handleEdit() {
    setIsEditing(true);
    setTimeout(() => {
      const input = document.getElementById("edit-comment");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 100);
  }

  return (
    <>
      <p className="order-2 max-w-3xl self-start hyphens-auto break-words">
        {comment.content}
      </p>

      <div
        className={`invisible row-span-2 ml-1 flex scale-90 place-self-end self-center opacity-0 duration-300 ${actionStates}`}
      >
        {isAuthor && (
          <div className="flex gap-1">
            <button onClick={handleEdit} className={blueButtonStyle}>
              <SquarePen size={18} />
            </button>

            <CommentDeleteButton
              commentId={comment.id}
              redButtonStyle={redButtonStyle}
            />
          </div>
        )}
      </div>
    </>
  );
}
