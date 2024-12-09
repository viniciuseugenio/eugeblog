import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchBookmarks } from "../../utils/http";
import BookmarkItem from "./BookmarkItem";
import Pagination from "./Pagination/Pagination";
import { queryClient } from "../../utils/http";

export default function BookmarksDropdown() {
  let content;
  const [page, setPage] = useState(1);

  const { data, isError, isPending, error } = useQuery({
    queryKey: ["bookmarks", page],
    queryFn: () => fetchBookmarks(page),
  });

  function handleSetPage(page) {
    setPage(page);
    queryClient.invalidateQueries(["bookmarks", { page }]);
  }

  function handleNextPage() {
    setPage((prev) => prev + 1);
    queryClient.invalidateQueries(["bookmarks", { page }]);
  }

  function handlePreviousPage() {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
    queryClient.invalidateQueries(["bookmarks", { page }]);
  }

  if (isPending) {
    content = (
      <div className="flex w-96 items-center justify-center p-4">
        <CircularProgress color="#493628" />
      </div>
    );
  }

  if (isError) {
    content = (
      <p className="flex w-96 items-center justify-center gap-2 p-4 text-red-500">
        <span className="flex items-center justify-center text-xl">
          <ion-icon name="alert-circle-outline"></ion-icon>
        </span>
        {error.message}
      </p>
    );
  }

  if (data) {
    if (data.results.length > 0) {
      content = (
        <>
          <ul className="flex min-h-[38rem] w-96 flex-grow flex-col gap-y-6 p-4">
            {data.results.map((bookmark) => (
              <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
          </ul>
          {data.pagination.qty_pages > 1 && (
            <div className="mb-4 mt-auto">
              <Pagination
                isBookmarks
                className="justify-center"
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                handleSetPage={handleSetPage}
                totalPagesDisplay={4}
                pagination={data.pagination}
              />
            </div>
          )}
        </>
      );
    }

    if (data.results.length === 0) {
      content = <p className="w-96 p-4 text-center">No bookmarks available.</p>;
    }
  }

  return (
    <div className="absolute right-0 top-14 z-10 bg-white shadow-xl">
      <div className="absolute -top-6 h-6 w-full bg-transparent" />
      <div className="absolute right-16 top-0 h-4 w-4 -translate-y-1/2 rotate-45 bg-white" />
      {content}
    </div>
  );
}
