import { Link } from "react-router";

export default function NavigationButton({ onClick, styling, link, icon }) {
  return onClick ? (
    <li className={styling} onClick={onClick}>
      <span className="flex">{icon}</span>
    </li>
  ) : (
    <Link className={styling} to={link}>
      <li className="flex">{icon}</li>
    </Link>
  );
}
