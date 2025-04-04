import { Plus } from "lucide-react";
import { Link } from "react-router";
import IconSpan from "./IconSpan";

export default function LoggedHeader() {
  return (
    <ul className="flex gap-3">
      <Link
        to="/post/create/"
        className="active:bg-accent group relative flex items-center justify-center rounded-lg py-2 px-4 duration-300 hover:bg-[#e2d3ca] hover:text-black"
      >
        <li className="flex gap-2">
          <IconSpan>
            <Plus size={20} />
          </IconSpan>
          <p className="text-sm">New post</p>
        </li>
      </Link>
    </ul>
  );
}
