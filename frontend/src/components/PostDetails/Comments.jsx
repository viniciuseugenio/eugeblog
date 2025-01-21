import { Link, useParams } from "react-router";
import { useAuthContext } from "../../store/auth-context.jsx";
import Comment from "./Comment";
import CommentForm from "./CommentForm.jsx";
import CommentsCount from "./CommentsCount.jsx";

export default function Comments({ data }) {
  const params = useParams();
  const postId = params.id;
  const { isLogged } = useAuthContext();

  return (
    <>
      {data && (
        <>
          <CommentsCount qty={data.length} postId={postId} />

          {isLogged ? (
            <CommentForm />
          ) : (
            <p className="mb-6">
              Any thoughts on this?&nbsp;
              <Link
                className="text-primary font-bold underline"
                to={`/login?next=/post/${postId}`}
                aria-label="Log in to share your thoughts on this post"
              >
                Log in
              </Link>
              &nbsp;and share them with us!
            </p>
          )}

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
