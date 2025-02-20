import { formatDate } from "../../utils/helpers";
import { CircleUser } from "lucide-react";

export default function Comment({ comment }) {
  const createdAt = formatDate(comment.created_at);
  const authorName = `${comment.author.first_name} ${comment.author.last_name}`;

  return (
    <div className="grid grid-cols-[2.4rem_1fr] grid-rows-[1.6rem_1fr]">
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
    </div>
  );
}
