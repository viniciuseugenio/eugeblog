import { Link } from "react-router-dom";
import { paginationRange } from "../utils/helpers";
import PaginationIcon from "./PaginationIcon";
import PageButton from "./PageButton";

export default function Pagination({
  isBookmarks,
  pagination,
  handleNextPage,
  handlePreviousPage,
  handleSetPage,
  className,
  totalPagesDisplay = 10,
}) {
  let content;
  const {
    qty_pages: qtyPages,
    current_page: currentPage,
    previous_page: previousPage,
    next_page: nextPage,
    has_previous: hasPrevious,
    has_next: hasNext,
  } = pagination;

  const qtyPagesArr = Array.from({ length: qtyPages }, (_, i) => i + 1);

  const pageRange = paginationRange(
    qtyPagesArr,
    currentPage,
    qtyPages,
    totalPagesDisplay,
  );

  const buttonClasses =
    "flex h-full items-center justify-center rounded border border-[#E4E0E1] px-3 py-1 duration-300 hover:bg-[#D6C0B3]";

  if (isBookmarks) {
    content = (
      <>
        {hasPrevious && (
          <button onClick={handlePreviousPage}>
            <PaginationIcon isPrevious />
          </button>
        )}

        {pageRange.map((page) => (
          <button
            key={page}
            onClick={() => {
              handleSetPage(page);
            }}
          >
            <PageButton
              key={page}
              page={page}
              buttonClasses={buttonClasses}
              currentPage={currentPage}
            />
          </button>
        ))}

        {hasNext && (
          <button onClick={handleNextPage}>
            <PaginationIcon />
          </button>
        )}
      </>
    );
  }

  if (!isBookmarks) {
    content = (
      <>
        {hasPrevious && (
          <Link to={`?page=${previousPage}`}>
            <PaginationIcon isPrevious />
          </Link>
        )}

        {pageRange.map((page) => (
          <Link key={page} to={`?page=${page}`}>
            <PageButton
              key={page}
              page={page}
              buttonClasses={buttonClasses}
              currentPage={currentPage}
            />
          </Link>
        ))}

        {hasNext && (
          <Link to={`?page=${nextPage}`}>
            <PaginationIcon />
          </Link>
        )}
      </>
    );
  }

  return (
    <div className={`${className ? className : ""} flex gap-3`}>{content}</div>
  );
}
