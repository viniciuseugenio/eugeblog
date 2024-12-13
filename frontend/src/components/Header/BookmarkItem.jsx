import { Link } from "react-router-dom";

export default function BookmarkItem({ bookmark }) {
  console.log(bookmark);

  return (
    <>
      <li key={bookmark.id}>
        <Link
          to={`/post/${bookmark.post.id}`}
          className="hover:text-secondary flex gap-3 duration-300"
        >
          <img
            src={bookmark.post.image}
            className="w-24 rounded-md"
            alt={bookmark.post.title}
          />
          <div className="flex flex-col">
            <span className="break-words font-medium">
              {bookmark.post.title}
            </span>
            <span className="mt-auto text-sm text-black text-opacity-70">
              {bookmark.post.author}
            </span>
          </div>
        </Link>
      </li>
      <hr />
    </>
  );
}
