import { formatDate } from "../../utils/helpers";
import { CircleUser } from "lucide-react";
import CommentDeleteButton from "./CommentDeleteButton";
import { useAuthContext } from "../../store/auth-context";

export default function Comment({ comment }) {
  const createdAt = formatDate(comment.created_at);
  const authorName = `${comment.author.first_name} ${comment.author.last_name}`;

  const { userId } = useAuthContext();
  const isAuthor = userId === comment.author.id;

  return (
    <div className="hover:bg-light/40 group relative grid grid-cols-[2.4rem_1fr] grid-rows-[1.6rem_1fr] rounded-md px-2 py-1 duration-300">
      <span className="row-span-2 self-start p-1">
        <CircleUser />
      </span>
      <div className="flex gap-1 self-start">
        <span className="font-semibold">{authorName}</span>
        &mdash; {createdAt}
      </div>
      <p className="max-w-3xl self-start hyphens-auto break-words">
        {comment.content}
      </p>
      {isAuthor && (
        <div className="invisible absolute right-3 top-1/2 -translate-y-1/2 scale-0 opacity-0 duration-300 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
          <CommentDeleteButton commentId={comment.id} />
        </div>
      )}
    </div>
  );
}
