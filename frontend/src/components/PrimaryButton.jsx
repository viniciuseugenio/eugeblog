import { CircularProgress } from "@mui/material";

export default function PrimaryButton({
  text,
  type,
  className,
  isPending,
  ...props
}) {
  return (
    <button
      type={type}
      className={`font-inherit bg-primary group flex w-full items-center justify-center rounded-lg py-2 text-white shadow-md shadow-neutral-400 duration-300 hover:bg-[#5b4a3e] ${className}`}
      {...props}
    >
      <span className="duration-300 ease-out group-hover:scale-110">
        {isPending ? <CircularProgress size={28} color="inherit" /> : `${text}`}
      </span>
    </button>
  );
}
