import { AnimatePresence } from "motion/react";
import { createContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../store/auth-context";
import OptionsList from "./OptionsList";
import BookmarksList from "./BookmarksList";
import Dropdown from "./Dropdown";
import UserPostsList from "./UserPostsList";

export const OptionsContext = createContext({
  dropdownPage: 0,
  dropdownOpen: true,
  DROPDOWN_PAGES: {},
  setDropdownPage: () => {},
  setDropdownOpen: () => {},
  initialDimensions: {},
});

export const DROPDOWN_PAGES = {
  HOME: 0,
  BOOKMARKS: 1,
  USER_POSTS: 2,
};

export default function UserDropdown() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPage, setDropdownPage] = useState(DROPDOWN_PAGES.HOME);
  const dropdownRef = useRef();
  const userInitials = user.firstName[0] + user.lastName[0];

  const dropdownContentList = {
    0: <OptionsList />,
    1: <BookmarksList />,
    2: <UserPostsList />,
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef &&
        !dropdownRef.current.contains(event.target) &&
        !document.getElementById("modal").contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "scale-110" : "scale-100"} duration-300 bg-accent rounded-full px-2 py-1.5 text-sm`}
        type="button"
      >
        {userInitials}
      </button>

      <OptionsContext.Provider
        value={{
          dropdownPage,
          setDropdownPage,
          dropdownOpen: isOpen,
          setDropdownOpen: setIsOpen,
          DROPDOWN_PAGES,
        }}
      >
        <AnimatePresence>
          {isOpen && <Dropdown>{dropdownContentList[dropdownPage]}</Dropdown>}
        </AnimatePresence>
      </OptionsContext.Provider>
    </div>
  );
}
