import Comments from "./Comments";
import PostActions from "./PostActions";
import PostMeta from "./PostMeta";
import { formatDate } from "../../utils/helpers";

export default function PostDetailsBase({
  post,
  isBookmarked,
  hasModifyPermission,
}) {
  const createdAt = formatDate(post.created_at);
  const image = `http://localhost:8000${post.image}`;

  return (
    <>
      <div className="flex flex-col items-center">
        <img src={image} className="mb-8 w-[52rem]" alt="" />

        <h1 className="mb-6 max-w-2xl text-center text-4xl font-bold">
          {post.title}
        </h1>

        <div className="mb-5 flex gap-4">
          <PostMeta>
            <ion-icon name="person-circle-outline" />
            <span>{post.author}</span>
          </PostMeta>

          <PostMeta>
            <ion-icon name="calendar-outline" />
            <span>{createdAt}</span>
          </PostMeta>

          <PostMeta>
            <ion-icon name="pricetag-outline" />
            <span>{post.category}</span>
          </PostMeta>
        </div>

        <p className="mb-12 text-center text-stone-700">{post.excerpt}</p>

        <p
          className="mb-6 leading-7"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></p>
      </div>

      <PostActions
        postId={post.id}
        canModify={hasModifyPermission}
        initialIsBookmarked={isBookmarked}
      />

      <Comments postId={post.id} />
    </>
  );
}
