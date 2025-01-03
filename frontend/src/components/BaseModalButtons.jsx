export default function BaseModalButtons({
  onClick,
  confirmColor = "text-light bg-red-600",
}) {
  return (
    <>
      <form method="dialog">
        <button className="bg-light cursor-pointer rounded-md px-3 py-1">
          Cancel
        </button>
      </form>
      <button
        className={`cursor-pointer rounded-md px-3 py-1 ${confirmColor}`}
        onClick={onClick}
      >
        Confirm
      </button>
    </>
  );
}
