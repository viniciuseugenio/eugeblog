import { Link } from "react-router";

export default function PageButton({
  page,
  onClick,
  link,
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
        <Link to={link}>{pageIcon}</Link>
      )}
    </>
  );
}
