import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CircleUser } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { formatDate } from "../../utils/helpers";
import { useAuthCheck } from "../../utils/hooks.js";
import PostActions from "./PostActions";
import PostMeta from "./PostMeta";
import PostDetailsSkeleton from "./PostDetailsSkeleton.jsx";

function estimateReadingTime(content) {
  const wordsPerMinute = 200;

  const text = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = text.split(" ").length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default function PostDetailsBase({ queryKey, fetchFn, isReview }) {
  // Check if user is authenticated
  useAuthCheck();

  const params = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchFn(params.id),
  });

  const post = data?.post;
  const createdAt = post && formatDate(post?.created_at);
  const isReviewer = data?.is_reviewer;
  const readingTime = post?.content ? estimateReadingTime(post?.content) : 0;

  if (isError) {
    throw new Error(error.message);
  }

  const reviewToast = useRef({
    shown: false,
    postId: params.id,
  });

  useEffect(() => {
    if (
      isReview &&
      isReviewer &&
      (!reviewToast.current.shown || reviewToast.current.postId != params.id)
    ) {
      toast.warning("You are reviewing a post.", {
        description: "Make sure all edits and decisions are intentional.",
        position: "top-center",
        closeButton: false,
      });
      reviewToast.current.shown = true;
      reviewToast.current.postId = params.id;
    }
  }, [isReview, params.id, isReviewer]);

  if (isLoading) {
    return <PostDetailsSkeleton />;
  }

  return (
    <article className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="mb-3 h-[500px] w-full">
        <img
          src={post?.image}
          className="h-full w-full rounded-t-md object-cover"
          alt=""
        />
      </div>

      <div className="flex flex-col p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="bg-light text-secondary inline-block rounded-full px-3 py-1 text-xs font-semibold">
            {post?.category.name}
          </span>

          <PostMeta>
            <Calendar className="h-4 w-4" />
            <span>{createdAt}</span>
          </PostMeta>

          <PostMeta>
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </PostMeta>
        </div>

        <h1 className="mb-6 text-4xl font-bold">{post?.title}</h1>

        <div className="mb-8 flex items-center gap-3">
          <CircleUser className="h-10 w-10" />
          <div>
            <p className="text-sm font-medium text-neutral-800">
              {post?.author}
            </p>
            <p className="text-xs text-neutral-500">
              Tech enthusiast and AI researcher
            </p>
          </div>
        </div>

        <PostActions
          isReviewer={data?.is_reviewer}
          isOwner={data?.is_owner}
          isReview={isReview}
          isBookmarked={data?.is_bookmarked || false}
        />

        <div
          className="prose prose-neutral mb-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
      </div>
    </article>
  );
}
