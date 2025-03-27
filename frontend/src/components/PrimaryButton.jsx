import { CircularProgress } from "@mui/material";

export default function PrimaryButton({
  label,
  type,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`font-inherit bg-primary/80 active:bg-primary min-w-32 hover:bg-primary/90 group flex w-full items-center justify-center rounded-md py-2 font-medium text-white shadow-sm shadow-neutral-400 duration-300 ${className}`}
      {...props}
    >
      <span className="flex items-center justify-center duration-300 ease-out">
        {disabled ? <CircularProgress size={24} color="inherit" /> : `${label}`}
      </span>
    </button>
  );
}
