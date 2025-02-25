export default function Tooltip({ text, topPosition }) {
  return (
    <span
      className={`${topPosition} absolute left-1/2 z-20 origin-bottom -translate-x-1/2 scale-0 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold opacity-0 shadow-md transition-all duration-200 ease-in-out group-hover:scale-100 group-hover:opacity-100 group-hover:delay-500 group-[.open]:scale-0`}
    >
      {text}
    </span>
  );
}
