import { Link } from "react-router-dom";

export default function FooterLink({ title, link }) {
  return (
    <li>
      <Link to={link} className="font-medium duration-300 hover:text-[#5b4a3e]">
        {title}
      </Link>
    </li>
  );
}
