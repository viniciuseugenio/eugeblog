export default function PageButton({ page, buttonClasses, currentPage }) {
  return (
    <span
      className={`${buttonClasses} ${page === currentPage ? "bg-[#AB886D]" : ""}`}
    >
      {page}
    </span>
  );
}
