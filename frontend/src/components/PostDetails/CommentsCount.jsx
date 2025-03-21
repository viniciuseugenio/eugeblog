import { MessageSquare } from "lucide-react";

export default function CommentsCount({ qty, isPending }) {
  let count;

  if (isPending) {
    count = "Loading comments...";
  } else {
    count = `Comments (${qty})`;
  }

  return (
    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
      <MessageSquare className="h-5" />
      {count}
    </h2>
  );
}
