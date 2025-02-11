import { Link } from "react-router";
import BookmarksDropdown from "./BookmarksDropdown";
import Dropdown from "./Dropdown";
import IconSpan from "./IconSpan";
import LogoutButton from "./LogoutButton";
import UserPostsDropdown from "./UserPostsDropdown";
import Tooltip from "../Tooltip";

export default function LoggedHeader() {
  const liClasses =
    "active:bg-accent flex items-center justify-center rounded-lg bg-[#e2d3ca] px-4 duration-300 hover:bg-[#decdc2] hover:text-black";

  return (
    <>
      <Link to="/post/create/" className={`${liClasses} group relative`}>
        <li>
          <IconSpan>
            <ion-icon name="add-outline"></ion-icon>
          </IconSpan>
        </li>
        <Tooltip text="Create a post" topPosition="top-11" />
      </Link>
      <li>
        <Dropdown
          label="User Posts"
          icon="file-tray-stacked-outline"
          DropdownContent={UserPostsDropdown}
        />
      </li>
      <li>
        <Dropdown
          label="Bookmarks"
          icon="bookmarks-outline"
          DropdownContent={BookmarksDropdown}
        />
      </li>
      <li className={liClasses}>
        <LogoutButton />
      </li>
    </>
  );
}
