export default function SocialIcon({ children, onClick }) {
  return (
    <button
      className="hover:text-primary cursor-pointer text-3xl duration-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
