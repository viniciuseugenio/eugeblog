import { formatDate } from "../../utils/helpers";

export default function Comment({ comment }) {
  const createdAt = formatDate(comment.created_at);

  return (
    <div className="grid grid-cols-[3rem_1fr] grid-rows-[1.6rem_1fr]">
      <span className="row-span-2 self-start">
        <ion-icon size="large" name="person-circle-outline"></ion-icon>
      </span>
      <div className="flex gap-1 self-start">
        <span className="font-semibold">{comment.author}</span>
        &mdash; {createdAt}
      </div>
      <p className="self-start">{comment.comment}</p>
    </div>
  );
}
