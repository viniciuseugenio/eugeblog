import { useQuery } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import { useParams } from "react-router";
import { getComments } from "../../utils/api/index.js";
import Comment from "./Comment";
import CommentForm from "./CommentForm.jsx";
import CommentsCount from "./CommentsCount.jsx";
import CommentsSkeleton from "./CommentsSkeleton.jsx";

export default function Comments() {
  const { id: postId } = useParams();

  const { data, isPending, isError } = useQuery({
    queryFn: () => getComments(postId),
    queryKey: ["comments", +postId],
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-red-700">
        <CircleAlert size={40} />
        <p className="text-xl font-medium">
          An error occurred while loading the comments. Please, try again later.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="p-6">
        <CommentsSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6">
      <CommentsCount qty={data?.length} postId={postId} isPending={isPending} />

      <CommentForm />

      <div className="flex flex-col gap-6">
        {data?.length >= 1 &&
          data.map((comment) => <Comment key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
}
