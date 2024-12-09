import { paginationRange } from "../../utils/helpers";
import PaginationIcon from "./PaginationIcon";
import PageButton from "./PageButton";
import NavigationButton from "../NavigationButton";
import { useMemo } from "react";

export default function Pagination({
  pagination,
  handleNextPage,
  handlePreviousPage,
  handleSetPage,
  className = "",
  totalPagesDisplay = 10,
}) {
  const {
    qty_pages: qtyPages,
    current_page: currentPage,
    previous_page: previousPage,
    next_page: nextPage,
    has_previous: hasPrevious,
    has_next: hasNext,
  } = pagination;

  const qtyPagesArr = useMemo(
    () => Array.from({ length: qtyPages }, (_, i) => i + 1),
    [qtyPages],
  );

  const pageRange = useMemo(
    () =>
      paginationRange(qtyPagesArr, currentPage, qtyPages, totalPagesDisplay),
    [qtyPagesArr, currentPage, qtyPages, totalPagesDisplay],
  );

  const buttonClasses =
    "flex items-center justify-center rounded px-3 py-1 text-black duration-300 hover:bg-[#E4E0E1]";

  return (
    <ul className={`${className} flex gap-3`}>
      {hasPrevious && (
        <NavigationButton
          onClick={handlePreviousPage}
          icon={<PaginationIcon isPrevious />}
          styling={buttonClasses}
          link={`?page=${previousPage}`}
        />
      )}

      {pageRange.map((page) => (
        <PageButton
          key={page}
          page={page}
          buttonClasses={buttonClasses}
          currentPage={currentPage}
          onClick={handleSetPage}
        />
      ))}

      {hasNext && (
        <NavigationButton
          onClick={handleNextPage}
          icon={<PaginationIcon />}
          styling={buttonClasses}
          link={`?page=${nextPage}`}
        />
      )}
    </ul>
  );
}
