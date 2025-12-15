import { Bookmark, Files, ListTodo, LogOutIcon, UserRound } from "lucide-react";
import { useContext } from "react";
import { useAuthContext } from "../../../store/auth-context";
import { hasPermission } from "../../../utils/helpers.js";
import LogoutButton from "../LogoutButton";
import { OptionsContext } from "./UserDropdown";
import UserDropdownItem from "./UserDropdownItem";

export default function OptionsList() {
  const { setDropdownPage, DROPDOWN_PAGES } = useContext(OptionsContext);
  const { user } = useAuthContext();
  const isPostReviewer = hasPermission(user, "post_reviewer");

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
      {isPostReviewer && (
        <UserDropdownItem
          onClick={() => setDropdownPage(DROPDOWN_PAGES.REVIEW_POSTS)}
          Icon={ListTodo}
          label="Posts for review"
        />
      )}
      <hr className="my-1" />
      <LogoutButton Icon={LogOutIcon} />
    </ul>
  );
}
