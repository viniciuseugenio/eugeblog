import { Link } from "react-router";

export default function PostItem({ post }) {
  const date = new Date(post.created_at);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

  return (
    <article className="flex w-60 flex-col shadow-md">
      <img src={post.image} alt="" className=" h-36 w-full rounded-t-sm" />
      <div className="flex flex-grow flex-col p-3">
        <header className="mb-5">
          <p className="mb-1 text-base font-medium leading-5">{post.title}</p>
          <p className="mb-5 text-xs">
            {post.author} &bull; {formattedDate}
          </p>
          <p className="text-sm">{post.excerpt}</p>
        </header>
        <Link
          to={`/post/${post.id}`}
          className="mt-auto flex items-center justify-end gap-1 font-medium duration-300 hover:text-[#5b4a3e]"
        >
          Read more
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </Link>
      </div>
    </article>
  );
}
