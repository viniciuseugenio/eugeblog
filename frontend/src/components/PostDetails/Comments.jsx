import { useParams } from "react-router";
import Comment from "./Comment";
import CommentForm from "./CommentForm.jsx";
import CommentsCount from "./CommentsCount.jsx";

export default function Comments({ data }) {
  const params = useParams();
  const postId = params.id;

  return (
    <>
      {data && (
        <>
          <CommentsCount qty={data.length} postId={postId} />

          <CommentForm />

          <div className="flex flex-col gap-6">
            {data.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
