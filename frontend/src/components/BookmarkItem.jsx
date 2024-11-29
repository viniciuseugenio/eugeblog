import { Link } from "react-router-dom";

export default function BookmarkItem({ bookmark }) {
  return (
    <li key={bookmark.id}>
      <Link
        to={`/post/${bookmark.post.id}`}
        className="hover:text-secondary flex gap-3 duration-300"
      >
        <img
          src={bookmark.post.image}
          className="w-24"
          alt={bookmark.post.title}
        />
        <span className="break-words font-medium">{bookmark.post.title}</span>
      </Link>
    </li>
  );
}
