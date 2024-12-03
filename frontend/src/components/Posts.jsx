import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import PostItem from "./PostDetails/PostItem";
import Pagination from "./Pagination";
import { loadPosts } from "../utils/http.js";
import BaseError from "./BaseError.jsx";

export default function Posts() {
  const currentUrl = new URL(window.location.href);
  const page = currentUrl.searchParams.get("page") || 1;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => loadPosts(page),
    staleTime: 5000,
  });

  return (
    <div className="mx-24 my-12 flex flex-grow flex-col items-center justify-center">
      {isError && (
        <BaseError title={error.message}>
          <p>
            {error.info?.message ||
              "We are very sorry for this, please, try again later."}
          </p>
        </BaseError>
      )}
      {isPending && <CircularProgress color="#493628" />}
      {data && (
        <>
          <div className="grid grid-cols-4 gap-x-44 gap-y-16 self-center">
            {data.posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
          {data.pagination.qty_pages > 1 && (
            <Pagination pagination={data.pagination} />
          )}
        </>
      )}
    </div>
  );
}
