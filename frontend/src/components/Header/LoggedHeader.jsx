import BookmarksDropdown from "./BookmarksDropdown";
import Dropdown from "./Dropdown";

export default function LoggedHeader({ handleLogout }) {
  return (
    <>
      <li>
        <form onSubmit={handleLogout}>
          <button className="rounded-lg bg-[#D6C0B3] px-4 py-2 font-medium duration-300 hover:text-[#5b4a3e] ">
            Logout
          </button>
        </form>
      </li>
      <li>
        <Dropdown DropdownContent={BookmarksDropdown}>Bookmarks</Dropdown>
      </li>
    </>
  );
}
