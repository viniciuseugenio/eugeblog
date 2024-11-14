export default function PrimaryButton({ text, className }) {
  return (
    <button
      className={`font-inherit bg-primary w-full rounded-md py-1 text-lg text-white duration-300 hover:bg-[#3a2b20] ${className}`}
    >
      {text}
    </button>
  );
}
