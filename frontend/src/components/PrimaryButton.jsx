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
      disabled={isPending}
      className={`font-inherit bg-primary group flex w-full min-w-[10rem] items-center justify-center rounded-lg py-2 text-white shadow-md shadow-neutral-400 duration-300 hover:bg-[#5b4a3e] ${className}`}
      {...props}
    >
      <span className="flex items-center justify-center duration-300 ease-out group-hover:scale-110">
        {isPending ? <CircularProgress size={24} color="inherit" /> : `${text}`}
      </span>
    </button>
  );
}
