import { Bookmark, Files, LogOutIcon, UserRound } from "lucide-react";
import { useContext } from "react";
import { OptionsContext } from "./UserDropdown";
import UserDropdownItem from "./UserDropdownItem";
import LogoutButton from "../LogoutButton";

export default function OptionsList() {
  const { setDropdownPage, DROPDOWN_PAGES } = useContext(OptionsContext);

  return (
    <ul>
      <UserDropdownItem Icon={UserRound} label="Profile" />
      <UserDropdownItem
        onClick={() => setDropdownPage(DROPDOWN_PAGES.USER_POSTS)}
        Icon={Files}
        label="Your posts"
      />
      <UserDropdownItem
        onClick={() => setDropdownPage(DROPDOWN_PAGES.BOOKMARKS)}
        Icon={Bookmark}
        label="Bookmarks"
      />
      <hr className="my-1" />
      <LogoutButton Icon={LogOutIcon} />
    </ul>
  );
}
