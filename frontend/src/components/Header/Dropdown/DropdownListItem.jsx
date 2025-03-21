import { Link } from "react-router";

function PostMeta({ reviewStatus }) {
  const statusMap = {
    A: { text: "This post was approved!", color: "text-green-700" },
    P: { text: "This post is pending review...", color: "text-yellow-600" },
    R: { text: "This post was unfortunately rejected", color: "text-red-600" },
  };

  const { text, color } = statusMap[reviewStatus];

  return <span className={`text-sm ${color} text-opacity-70`}>{text}</span>;
}

export default function DropdownListItem({ post, isArchived }) {
  let url = `/post/${post.id}`;
  const reviewStatus = post.review_status;

  let postMeta = (
    <span className="text-xs text-black text-opacity-60">By {post.author}</span>
  );

  if (isArchived) {
    postMeta = <PostMeta reviewStatus={reviewStatus} />;
  }

  if (reviewStatus === "P") {
    url = `/post/review/${post.id}`;
  }

  return (
    <li className="ring-light max-h-24 rounded-md text-sm ring-1 ring-inset duration-300 ease-out hover:bg-stone-200">
      <Link to={url} className="flex h-full gap-1 duration-300">
        <div className="max-w-28 rounded-l-md">
          <img
            src={post.image}
            className="h-full w-full rounded-l-md object-cover"
            alt={post.title}
          />
        </div>

        <div className="flex flex-col justify-center gap-1 p-3">
          <span className="break-words font-medium">{post.title}</span>
          {postMeta}
        </div>
      </Link>
    </li>
  );
}
