import { CircleUser } from "lucide-react";
import { useAuthContext } from "../../store/auth-context";
import { formatDate } from "../../utils/helpers";
import CommentDeleteButton from "./CommentDeleteButton";

export default function Comment({ comment }) {
  const createdAt = formatDate(comment.created_at);
  const authorName = `${comment.author.first_name} ${comment.author.last_name}`;

  const { userId } = useAuthContext();
  const isAuthor = userId === comment.author.id;
  const columns = isAuthor
    ? "grid-cols-[2.4rem_1fr_2.6rem]"
    : "grid-cols-[2.4rem_1fr]";

  const deleteButtonStates =
    "group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:visible group-hover:scale-100 group-hover:opacity-100";

  return (
    <div
      tabIndex={0}
      className={`hover:bg-light/40 focus:bg-light/40 group grid ${columns} grid-rows-[1.6rem_1fr] rounded-md px-2 py-1 duration-300`}
    >
      <span className="row-span-2 self-start p-1">
        <CircleUser />
      </span>
      <div className="flex gap-1 self-start">
        <span className="font-semibold">{authorName}</span>
        &mdash; {createdAt}
      </div>
      <p className="order-2 max-w-3xl self-start hyphens-auto break-words">
        {comment.content}
      </p>
      {isAuthor && (
        <div
          className={`invisible row-span-2 ml-1 scale-0 self-center opacity-0 duration-300 ${deleteButtonStates}`}
        >
          <CommentDeleteButton commentId={comment.id} />
        </div>
      )}
    </div>
  );
}
