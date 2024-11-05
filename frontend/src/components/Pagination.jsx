import { Link } from "react-router-dom";
import { paginationRange } from "../utils/helpers";

export default function Pagination({ pagination }) {
  const {
    qty_pages: qtyPages,
    current_page: currentPage,
    previous_page: previousPage,
    next_page: nextPage,
    has_previous: hasPrevious,
    has_next: hasNext,
  } = pagination;

  const qtyPagesArr = Array.from({ length: qtyPages }, (_, i) => i + 1);

  const pageRange = paginationRange(qtyPagesArr, currentPage, qtyPages);

  const buttonClasses =
    "flex h-full items-center justify-center rounded border border-[#E4E0E1] px-3 py-1 duration-300 hover:bg-[#D6C0B3]";

  return (
    <div className="mt-12 flex grow gap-3">
      {hasPrevious && (
        <Link to={`?page=${previousPage}`}>
          <span className={buttonClasses}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </span>
        </Link>
      )}

      {pageRange.map((page) => (
        <Link key={page} to={`?page=${page}`}>
          <span
            className={`${buttonClasses} ${page === currentPage ? "bg-[#AB886D]" : ""}`}
          >
            {page}
          </span>
        </Link>
      ))}

      {hasNext && (
        <Link to={`?page=${nextPage}`}>
          <span className={buttonClasses}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </span>
        </Link>
      )}
    </div>
  );
}
