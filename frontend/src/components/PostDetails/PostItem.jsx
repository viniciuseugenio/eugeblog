import { Link } from "react-router-dom";

export default function PostItem({ post }) {
  return (
    <div className="max-w-[15rem] shadow-md">
      <img src={post.image} alt="" className="mb-4 h-36 w-full rounded-t-sm" />
      <div className="flex flex-col px-5 pb-3">
        <div className="pb-5">
          <p className="pb-5 text-lg font-medium leading-5">{post.title}</p>
          <p className="text-sm">{post.excerpt}</p>
        </div>
        <Link
          to={`/post/${post.id}`}
          className="flex items-center justify-end gap-1 font-medium duration-300 hover:text-[#5b4a3e]"
        >
          Read
          <ion-icon
            class="read-icon"
            name="arrow-forward-circle-outline"
          ></ion-icon>
        </Link>
      </div>
    </div>
  );
}
