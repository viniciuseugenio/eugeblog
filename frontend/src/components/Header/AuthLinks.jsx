import { Link } from "react-router";

export default function AuthLinks() {
  return (
    <ul className="ml-3 flex gap-3">
      <li>
        <Link
          to="/signup"
          className="font-medium duration-300 hover:text-[#5b4a3e]"
        >
          Get started
        </Link>
      </li>
      <li>
        <Link
          to="/login"
          className="rounded-lg bg-[#D6C0B3] px-4 py-2 font-medium duration-300 hover:text-[#5b4a3e] "
        >
          Log in
        </Link>
      </li>
    </ul>
  );
}
