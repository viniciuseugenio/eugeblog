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
              <div className="mb-12">
                <h2 className="mb-4 text-3xl font-bold">
                  {loadedComments.length} comments
                </h2>

                {isAuthenticated ? (
                  <Form method="post">
                    <TextArea />
                    <div className={` flex justify-end gap-3 duration-300`}>
                      <button
                        type="reset"
                        className="rounded-lg bg-[#E4E0E1] px-3 py-1 duration-300 hover:bg-[#cdcacb]"
                        disabled={navigation.state === "submitting"}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={navigation.state === "submitting"}
                        className="rounded-lg bg-[#493628] px-3 py-1 text-[#E4E0E1] duration-300 hover:bg-[#33261c]"
                      >
                        Comment
                      </button>
                    </div>
                  </Form>
                ) : (
                  <p>
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
