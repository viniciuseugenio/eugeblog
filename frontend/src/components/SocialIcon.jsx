export default function SocialIcon({ link, children }) {
  return (
    <li>
      <a
        href={link}
        className="hover:text-primary cursor-pointer text-3xl duration-300"
        target="_blank"
      >
        {children}
      </a>
    </li>
  );
}
