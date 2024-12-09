import { Link } from "react-router-dom";

export default function PageButton({
  page,
  onClick,
  buttonClasses,
  currentPage,
}) {
  const pageIcon = (
    <span
      className={`${buttonClasses} ${page === currentPage ? "bg-[#D6C0B3]" : ""}`}
    >
      {page}
    </span>
  );

  return (
    <>
      {onClick ? (
        <button onClick={() => onClick(page)}>{pageIcon}</button>
      ) : (
        <Link to={`?page=${page}`}>{pageIcon}</Link>
      )}
    </>
  );
}
