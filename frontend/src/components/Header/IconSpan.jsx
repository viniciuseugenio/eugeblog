export default function IconSpan({ children, isOpen }) {
  return (
    <span
      className={`${isOpen && "rotate-180"} flex items-center justify-center duration-300`}
    >
      {children}
    </span>
  );
}
