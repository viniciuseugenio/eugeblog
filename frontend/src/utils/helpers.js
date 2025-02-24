export function formatDate(date) {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);
}

export function paginationRange(
  pageRange,
  currentPage,
  totalPages,
  totalPagesDisplay = 10,
) {
  const displayLimit = Math.min(totalPagesDisplay, totalPages);

  let middle = Math.floor(totalPagesDisplay / 2);
  let start = Math.max(1, currentPage - middle);
  let end = Math.min(totalPages, currentPage + middle);

  if (currentPage <= middle) {
    end = Math.min(totalPages, displayLimit);
  } else if (currentPage + middle >= totalPages) {
    start = Math.max(1, totalPages - displayLimit + 1);
  }

  return pageRange.slice(start - 1, end);
}
