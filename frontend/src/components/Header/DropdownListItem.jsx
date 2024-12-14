import { Link } from "react-router-dom";

export default function DropdownListItem({ post, isArchived }) {
  const reviewStatus = post.review_status;
  console.log(isArchived);
  let postMeta = (
    <span className="mt-auto text-sm text-black text-opacity-70">
      {post.author}
    </span>
  );

  if (isArchived) {
    if (reviewStatus === "A") {
      postMeta = (
        <span className="mt-auto text-sm text-green-700 text-opacity-70">
          This post was approved!
        </span>
      );
    }

    if (reviewStatus === "P") {
      postMeta = (
        <span className="mt-auto text-sm text-yellow-600 text-opacity-70">
          This post is pending review...
        </span>
      );
    }
    if (reviewStatus === "R") {
      postMeta = (
        <span className="mt-auto text-sm text-red-600 text-opacity-70">
          This post was unfortunately rejected
        </span>
      );
    }
  }

  return (
    <>
      <li>
        <Link
          to={`/post/${post.id}`}
          className="hover:text-secondary flex gap-3 duration-300"
        >
          <img src={post.image} className="w-24 rounded-md" alt={post.title} />
          <div className="flex flex-col">
            <span className="break-words font-medium">{post.title}</span>
            {postMeta}
          </div>
        </Link>
      </li>
      <hr />
    </>
  );
}
