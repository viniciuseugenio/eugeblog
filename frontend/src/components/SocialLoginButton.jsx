export default function SocialLoginButton({ site, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border-accent hover:bg-light active:bg-accent/70 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 duration-300"
    >
      {icon}
      <span className="text-sm font-medium">Continue with {site}</span>
    </button>
  );
}
