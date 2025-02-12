import { Link } from "react-router";
import BookmarksDropdown from "./BookmarksDropdown";
import Dropdown from "./Dropdown";
import IconSpan from "./IconSpan";
import UserPostsDropdown from "./UserPostsDropdown";

export default function LoggedHeader() {
  return (
    <ul className="flex gap-3">
      <li>
        <Dropdown
          label="User Posts"
          icon="person-outline"
          DropdownContent={UserPostsDropdown}
        />
      </li>

      <li>
        <Dropdown
          label="Bookmarks"
          icon="bookmark-outline"
          DropdownContent={BookmarksDropdown}
        />
      </li>

      <Link
        to="/post/create/"
        className="active:bg-accent group relative flex items-center justify-center rounded-lg px-4 duration-300 hover:bg-[#e2d3ca] hover:text-black"
      >
        <li className="flex gap-1">
          <IconSpan>
            <ion-icon name="add-outline"></ion-icon>
          </IconSpan>
          <p className="text-sm">New post</p>
        </li>
      </Link>
    </ul>
  );
}
