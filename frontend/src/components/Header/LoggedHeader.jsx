import { Link } from "react-router";
import BookmarksDropdown from "./BookmarksDropdown";
import Dropdown from "./Dropdown";
import IconSpan from "./IconSpan";
import UserPostsDropdown from "./UserPostsDropdown";
import { User, Bookmark, Plus } from "lucide-react";

export default function LoggedHeader() {
  return (
    <ul className="flex gap-3">
      <li>
        <Dropdown
          label="User Posts"
          icon={<User size={20} />}
          DropdownContent={UserPostsDropdown}
        />
      </li>

      <li>
        <Dropdown
          label="Bookmarks"
          icon={<Bookmark size={20} />}
          DropdownContent={BookmarksDropdown}
        />
      </li>

      <Link
        to="/post/create/"
        className="active:bg-accent group relative flex items-center justify-center rounded-lg px-4 duration-300 hover:bg-[#e2d3ca] hover:text-black"
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
