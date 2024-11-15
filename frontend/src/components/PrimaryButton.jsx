import { CircularProgress } from "@mui/material";

export default function PrimaryButton({ text, className, state }) {
  return (
    <button
      className={`font-inherit bg-primary flex w-full items-center justify-center rounded-md py-1 text-lg text-white duration-300 hover:bg-[#3a2b20] ${className}`}
    >
      {state === "submitting" ? (
        <CircularProgress size={28} color="inherit" />
      ) : (
        `${text}`
      )}
    </button>
  );
}
