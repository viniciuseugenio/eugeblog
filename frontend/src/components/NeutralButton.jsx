export default function NeutralButton({
  onClick,
  disabled,
  label,
  type = "button",
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className="rounded-md px-4 py-2 text-sm font-medium ring-1 ring-stone-300 duration-300 hover:bg-stone-200 active:bg-stone-300"
    >
      {label}
    </button>
  );
}
