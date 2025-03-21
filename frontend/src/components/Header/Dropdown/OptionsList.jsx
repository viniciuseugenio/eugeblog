import OptionsListItem from "./OptionsListItem";
import { Bookmark, UserRound, ClipboardCheck } from "lucide-react";
import { DROPDOWN_PAGES } from "./OptionsDropdown";
import { motion } from "motion/react";

export default function OptionsList({ setSelectedContent }) {
  return (
    <motion.ul
      layout
      className="m-1 flex w-48 flex-1 flex-col gap-1"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: "spring", bounce: 0 }}
    >
      <OptionsListItem
        Icon={Bookmark}
        label="Bookmarks"
        setOption={() => setSelectedContent(DROPDOWN_PAGES.BOOKMARKS)}
      />
      <OptionsListItem
        Icon={UserRound}
        label="Your Posts"
        setOption={() => setSelectedContent(DROPDOWN_PAGES.USER_POSTS)}
      />
    </motion.ul>
  );
}
