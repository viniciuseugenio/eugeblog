import Comments from "./Comments";
import PostActions from "./PostActions";
import PostMeta from "./PostMeta";
import { formatDate } from "../../utils/helpers";
import { useContext } from "react";
import { PostDetailsContext } from "./PostDetailsBase.jsx";
import { Tag, CalendarDays, CircleUserRound } from "lucide-react";

export default function PostDetails({ post }) {
  const createdAt = formatDate(post.created_at);
  const { isReview } = useContext(PostDetailsContext);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mb-8 h-[500px]">
          <img src={post.image} className="h-full w-full rounded-md" alt="" />
        </div>

        <h1 className="mb-6 max-w-2xl text-center text-4xl font-bold">
          {post.title}
        </h1>

        <div className="mb-5 flex gap-4">
          <PostMeta>
            <CircleUserRound size={16} />
            <span>{post.author}</span>
          </PostMeta>

          <PostMeta>
            <CalendarDays size={16} />
            <span>{createdAt}</span>
          </PostMeta>

          <PostMeta>
            <Tag size={16} />
            <span>{post.category.name}</span>
          </PostMeta>
        </div>

        <p className="mb-12 text-center text-stone-700">{post.excerpt}</p>

        <p
          className="mb-6 leading-7"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></p>
      </div>

      <PostActions />

      {!isReview && <Comments />}
    </>
  );
}
