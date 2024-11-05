import { CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { Form, Await } from "react-router-dom";
import TextArea from "./TextArea";
import Comment from "./Comment";

export default function Comments({ comments }) {
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
                <Form method="post">
                  <TextArea />
                  <div className={` flex justify-end gap-3 duration-300`}>
                    <button
                      type="reset"
                      className="rounded-lg bg-[#E4E0E1] px-3 py-1 duration-300 hover:bg-[#cdcacb]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#493628] px-3 py-1 text-[#E4E0E1] duration-300 hover:bg-[#33261c]"
                    >
                      Comment
                    </button>
                  </div>
                </Form>
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
