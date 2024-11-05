export default function SocialIcon({ link, children }) {
  return (
    <li>
      <a href={link} className="duration-300 hover:text-black" target="_blank">
        {children}
      </a>
    </li>
  );
}
