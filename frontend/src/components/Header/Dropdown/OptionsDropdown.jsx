import { createContext, useState } from "react";
import BookmarksList from "./BookmarksList";
import Dropdown from "./Dropdown";
import OptionsList from "./OptionsList";
import UserPostsList from "./UserPostsList";

export const DROPDOWN_PAGES = {
  INITIAL: 0,
  BOOKMARKS: 1,
  USER_POSTS: 2,
};

export const OptionsDropdownCtx = createContext({
  isOpen: false,
  setIsOpen: () => {},
  setSelectedContent: () => {},
  selectedContent: 0,
  DROPDOWN_PAGES,
});

export default function OptionsDropdown({ isOpen, setIsOpen }) {
  const [selectedContent, setSelectedContent] = useState(
    DROPDOWN_PAGES.INITIAL,
  );

  const dropdownContentList = {
    0: () => <OptionsList setSelectedContent={setSelectedContent} />,
    1: BookmarksList,
    2: UserPostsList,
  };

  const context = {
    isOpen,
    setIsOpen,
    setSelectedContent,
    selectedContent,
    DROPDOWN_PAGES,
  };

  return (
    <OptionsDropdownCtx.Provider value={context}>
      <Dropdown DropdownContent={dropdownContentList[selectedContent]} />
    </OptionsDropdownCtx.Provider>
  );
}
