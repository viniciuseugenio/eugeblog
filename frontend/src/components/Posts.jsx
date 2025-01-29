import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import PostItem from "./PostDetails/PostItem";
import Pagination from "./Pagination/Pagination.jsx";
import { loadPosts } from "../utils/http";
import BaseError from "./BaseError.jsx";
import { useSearchParams } from "react-router";

export default function Posts() {
  let content;

  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("q");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", { currentPage, search }],
    queryFn: () => loadPosts({ currentPage, search }),
    staleTime: 5000,
  });

  if (isError) {
    content = (
      <BaseError title="Unable to load posts">
        <p>
          {error.message ||
            "We're sorry, but we couldn't load the posts. Please try again later."}
        </p>
      </BaseError>
    );
  }

  if (isPending) {
    content = <CircularProgress color="#493628" />;
  }

  if (data) {
    if (data.posts.length >= 1) {
      content = (
        <>
          <div className="grid grid-cols-1 gap-x-28 gap-y-16 self-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {data.posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
          {data.pagination.qty_pages > 1 && (
            <Pagination
              className="mt-12"
              pagination={data.pagination}
              search={search}
            />
          )}
        </>
      );
    } else {
      const errorText = {
        title: search ? "No results were found." : "No posts available.",
        message: search
          ? "We couldn't find any posts matching your search. Try adjusting your search terms or explore other topics."
          : "It looks like there aren't any posts available. Please, try again later.",
      };
      content = (
        <BaseError title={errorText.title}>
          <p>{errorText.message}</p>
        </BaseError>
      );
    }
  }

  return (
    <div className="mx-24 my-12 flex flex-grow flex-col items-center justify-center">
      {content}
    </div>
  );
}
