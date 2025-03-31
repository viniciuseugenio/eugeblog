import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CircleAlert, X } from "lucide-react";
import { motion } from "motion/react";
import { useContext, useState } from "react";
import Pagination from "../../Pagination/Pagination.jsx";
import DropdownListItem from "./DropdownListItem.jsx";
import ItemSkeleton from "./ItemSkeleton.jsx";
import { DROPDOWN_PAGES, OptionsContext } from "./UserDropdown.jsx";

export default function DropdownList({
  queryKey,
  queryFn,
  emptyMessage,
  label,
}) {
  let content;
  const [page, setPage] = useState(1);
  const isArchived = queryKey[0] === "archivedPosts";

  const { setDropdownPage, setDropdownOpen } = useContext(OptionsContext);

  const { data, isError, isPending, error } = useQuery({
    queryKey: [queryKey, { page }],
    queryFn: () => queryFn(page),
  });

  function handleSetPage(page) {
    setPage(page);
  }

  function handleNextPage() {
    setPage((prev) => prev + 1);
  }

  function handlePreviousPage() {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  }

  if (isPending) {
    content = (
      <div className="mb-6 flex w-full flex-col items-start justify-center gap-y-3 p-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <ItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    content = (
      <p className="p-3 text-center text-red-500">
        <span className="flex items-center justify-center text-2xl">
          <CircleAlert />
        </span>
        {error.message}
      </p>
    );
  }

  if (data) {
    if (data.results.length >= 1) {
      content = (
        <>
          <ul className="flex flex-col gap-y-3 p-2 pb-6">
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
      content = <p className="w-96 p-4 text-center">{emptyMessage}</p>;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col absolute inset-0"
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
    >
      <div className="mb-3 flex items-center justify-between border-b p-4">
        <button
          onClick={() => setDropdownPage(DROPDOWN_PAGES.HOME)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-neutral-500 duration-300 hover:text-blue-600"
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-lg font-semibold">{label}</h1>
        <button
          onClick={() => setDropdownOpen(false)}
          className="text-neutral-500 duration-300 hover:text-red-600"
          aria-label="Close dropdown"
        >
          <X size={18} />
        </button>
      </div>

      <motion.div className="flex h-full flex-col items-center justify-start">
        {content}
      </motion.div>
    </motion.div>
  );
}
