import { useState } from "react";
import DropdownListItem from "./DropdownListItem.jsx";
import Pagination from "../Pagination/Pagination.jsx";
import { queryClient } from "../../utils/http";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";

export default function DropdownList({ queryKey, queryFn }) {
  let content;
  const [page, setPage] = useState(1);
  const isArchived = queryKey[0] === "archivedPosts";

  const { data, isError, isPending, error } = useQuery({
    queryKey: [queryKey, { page }],
    queryFn: () => queryFn(page),
  });

  function handleSetPage(page) {
    setPage(page);
    queryClient.invalidateQueries([queryKey]);
  }

  function handleNextPage() {
    setPage((prev) => prev + 1);
    queryClient.invalidateQueries([queryKey]);
  }

  function handlePreviousPage() {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
    queryClient.invalidateQueries([queryKey]);
  }

  if (isPending) {
    content = <CircularProgress color="#493628" />;
  }

  if (isError) {
    content = (
      <p className="p-3 text-center text-red-500">
        <span className="flex items-center justify-center text-2xl">
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
          <ul className="flex flex-grow flex-col gap-y-6 p-4">
            {data.results.map((item) => (
              <DropdownListItem
                key={item.id}
                post={item.post || item}
                isArchived={isArchived}
              />
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
    } else {
      content = <p className="w-96 p-4 text-center">No bookmarks available.</p>;
    }
  }

  return (
    <div className="flex min-h-[42rem] min-w-[26rem] flex-col items-center justify-center">
      {content}
    </div>
  );
}
