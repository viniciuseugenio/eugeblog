import { CircularProgress } from "@mui/material";

export default function PrimaryButton({ text, type, className, isPending }) {
  return (
    <button
      type={type}
      className={`font-inherit bg-primary flex w-full items-center justify-center rounded-md py-1 text-lg text-white duration-300 hover:bg-[#3a2b20] ${className}`}
    >
      {isPending ? <CircularProgress size={28} color="inherit" /> : `${text}`}
    </button>
  );
}
