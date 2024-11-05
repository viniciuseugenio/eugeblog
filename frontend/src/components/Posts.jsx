import { CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { useLoaderData, defer, Await, json } from "react-router-dom";
import PostItem from "./PostDetails/PostItem";
import Pagination from "./Pagination";

export default function Posts() {
  const { data } = useLoaderData();

  return (
    <div className="mx-24 my-12 flex flex-grow flex-col items-center justify-center">
      <Suspense fallback={<CircularProgress />}>
        <Await resolve={data}>
          {(loadedData) => (
            <>
              <div className="grid grid-cols-4 gap-x-44 gap-y-16 self-center">
                {loadedData.posts.map((post) => (
                  <PostItem key={post.id} post={post} />
                ))}
              </div>
              {loadedData.qtyPages > 1 && (
                <Pagination pagination={loadedData.pagination} />
              )}
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

async function loadPosts(currentPage) {
  let url = "http://localhost:8000/api/posts/";
  if (currentPage > 1) {
    url += `?page=${currentPage}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw json(
      { message: "Something went wrong while loading posts." },
      { status: response.status },
    );
  }

  const data = await response.json();

  return {
    posts: data.results,
    pagination: data.pagination,
  };
}

export async function loader({ request }) {
  const currentUrl = new URL(request.url);
  const page = +currentUrl.searchParams.get("page") || 1;

  return defer({
    data: loadPosts(page),
  });
}
