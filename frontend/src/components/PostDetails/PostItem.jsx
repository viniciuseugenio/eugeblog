import { CalendarDays, CircleUserRound } from "lucide-react";
import { Link } from "react-router";

export default function PostItem({ post }) {
  const date = new Date(post.created_at);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

  return (
    <article className="max-w-80 flex flex-col rounded-md border bg-white duration-300 hover:shadow-md">
      <div className="max-h-44 overflow-hidden rounded-t-md">
        <img src={post.image} alt="" className="object-cover" />
      </div>

      <div className="flex flex-grow flex-col p-4">
        <header className="mb-5">
          <div className="mb-3 flex items-center justify-between text-xs">
            <p className="bg-light text-secondary inline-block rounded-full px-2 py-1 font-medium">
              {post.category.name}
            </p>
            <div className="flex items-center justify-center gap-1 opacity-75">
              <CalendarDays size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>

          <Link
            to={`/post/${post.id}`}
            className="text-wrap mb-2 text-lg font-semibold leading-5 decoration-1 underline-offset-2 hover:underline"
          >
            {post.title}
          </Link>

          <div className="mb-3 mt-1 flex items-center gap-1">
            <CircleUserRound size={16} />
            <p className="text-sm font-medium">{post.author}</p>
          </div>
          <p className="line-clamp-3 text-sm opacity-70">{post.excerpt}</p>
        </header>
        <Link
          to={`/post/${post.id}`}
          className="hover:bg-accent/50 active:bg-accent/70 border-accent/50 mt-auto flex items-center justify-center rounded-md border px-3 py-1.5 font-medium duration-300"
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
