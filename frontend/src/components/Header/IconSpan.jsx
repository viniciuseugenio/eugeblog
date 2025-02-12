export default function IconSpan({ children, isOpen, size = "lg" }) {
  return (
    <span
      className={`${isOpen && "rotate-180"} text-${size} flex items-center justify-center duration-300`}
    >
      {children}
    </span>
  );
}
