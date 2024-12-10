import { Link } from "react-router-dom";
import BookmarksDropdown from "./BookmarksDropdown";
import Dropdown from "./Dropdown";
import IconSpan from "./IconSpan";

export default function LoggedHeader({ handleLogout }) {
  const liClasses =
    "active:bg-accent flex items-center justify-center rounded-lg bg-[#e2d3ca] px-4 duration-300 hover:bg-[#decdc2] hover:text-black";

  return (
    <>
      <Link className={liClasses}>
        <li>
          <IconSpan>
            <ion-icon name="add-outline"></ion-icon>
          </IconSpan>
        </li>
      </Link>
      <li>
        <Dropdown DropdownContent={BookmarksDropdown}>
          <IconSpan>
            <ion-icon name="bookmarks-outline"></ion-icon>
          </IconSpan>
        </Dropdown>
      </li>
      <li className={liClasses}>
        <form className="h-full" onSubmit={handleLogout}>
          <button className="flex h-full items-center justify-center gap-2 py-2">
            <IconSpan>
              <ion-icon name="exit-outline"></ion-icon>
            </IconSpan>
            <span>Logout</span>
          </button>
        </form>
      </li>
    </>
  );
}
