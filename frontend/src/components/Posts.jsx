import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import PostItem from "./PostDetails/PostItem";
import Pagination from "./Pagination/Pagination.jsx";
import { loadPosts } from "../utils/http";
import BaseError from "./BaseError.jsx";
import { useSearchParams } from "react-router";

export default function Posts() {
  const [searchParams, _] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", page],
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
            <Pagination className="mt-12" pagination={data.pagination} />
          )}
        </>
      )}
    </div>
  );
}
