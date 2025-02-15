import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export default function PostItem({ post }) {
  const date = new Date(post.created_at);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

  return (
    <article className="max-w-60 flex flex-col shadow-md">
      <img src={post.image} alt="" className="h-36 w-full rounded-t-sm" />
      <div className="flex flex-grow flex-col p-3">
        <header className="mb-5">
          <p className="mb-2 inline-block rounded-md bg-gray-200 px-3 py-1 text-xs ">
            {post.category.name}
          </p>

          <p className="text-wrap mb-1 text-base font-medium leading-5">
            {post.title}
          </p>
          <p className="mb-5 text-xs">
            {post.author} &bull; {formattedDate}
          </p>
          <p className="line-clamp-3 text-sm">{post.excerpt}</p>
        </header>
        <div className="hover:bg-accent/50 mt-auto flex items-center justify-center self-end rounded-md px-3 py-1 font-medium duration-300">
          <Link
            to={`/post/${post.id}`}
            className="flex items-center justify-center"
          >
            Read more
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
