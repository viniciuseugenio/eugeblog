export default function Tooltip({ text, topPosition }) {
  return (
    <span
      className={`${topPosition} absolute left-1/2 z-20 -translate-x-1/2 scale-0 transform whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold shadow-md transition-transform duration-300 ease-in-out group-hover:scale-100 group-[.open]:scale-0`}
    >
      {text}
    </span>
  );
}
