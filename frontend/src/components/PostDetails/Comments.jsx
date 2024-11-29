import { CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { Await, Form, Link } from "react-router-dom";
import Comment from "./Comment";
import TextArea from "./TextArea";

export default function Comments({ comments, isAuthenticated, postId }) {
  return (
    <>
      <Suspense fallback={<CircularProgress />}>
        <Await resolve={comments}>
          {(loadedComments) => (
            <>
              <div>
                <h2 className="mb-4 text-3xl font-bold">
                  {loadedComments.length} comments
                </h2>

                {isAuthenticated ? (
                  <Form method="post">
                    <TextArea />
                  </Form>
                ) : (
                  <p className="mb-6">
                    Any thoughts on this?{" "}
                    <Link
                      className="text-primary font-bold underline"
                      to={`/login?next=/post/${postId}`}
                    >
                      Log in
                    </Link>{" "}
                    and come here to share them!
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-6">
                {loadedComments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </>
  );
}
