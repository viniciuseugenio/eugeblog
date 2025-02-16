import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import { useParams } from "react-router";
import { loadComments } from "../../utils/http";
import Comment from "./Comment";
import CommentForm from "./CommentForm.jsx";
import CommentsCount from "./CommentsCount.jsx";

export default function Comments() {
  const { id: postId } = useParams();

  const { data, isPending, isError } = useQuery({
    queryFn: () => loadComments(postId),
    queryKey: ["comments", postId],
    retry: 1,
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

  return (
    <>
      <CommentsCount qty={data?.length} postId={postId} isPending={isPending} />

      <CommentForm />

      <div className="flex flex-col gap-6">
        {isPending ? (
          <div className="self-center">
            <CircularProgress color="#493628" />
          </div>
        ) : (
          <>
            {data?.length >= 1 &&
              data.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
          </>
        )}
      </div>
    </>
  );
}
