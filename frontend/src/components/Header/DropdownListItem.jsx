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
  const reviewStatus = post.review_status;

  let postMeta = (
    <span className="text-sm text-black text-opacity-70">{post.author}</span>
  );

  if (isArchived) {
    postMeta = <PostMeta reviewStatus={reviewStatus} />;
  }

  return (
    <>
      <li>
        <Link
          to={`/post/${post.id}`}
          className="hover:text-secondary flex gap-3 duration-300"
        >
          <img src={post.image} className="w-24 rounded-md" alt={post.title} />
          <div className="flex flex-col justify-center">
            <span className="break-words font-medium">{post.title}</span>
            {postMeta}
          </div>
        </Link>
      </li>
      <hr />
    </>
  );
}
