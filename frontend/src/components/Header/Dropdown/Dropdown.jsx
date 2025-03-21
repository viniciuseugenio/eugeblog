import { AnimatePresence, motion } from "motion/react";
import { useContext } from "react";
import { OptionsDropdownCtx } from "./OptionsDropdown";

export default function Dropdown({ DropdownContent }) {
  const { DROPDOWN_PAGES, selectedContent, isOpen } =
    useContext(OptionsDropdownCtx);
  const isInitial = selectedContent === DROPDOWN_PAGES.INITIAL;

  const dropHeight = isInitial ? "76px" : "633px";
  const dropWidth = isInitial ? "202px" : "418px";

  return (
    <AnimatePresence className="flex h-full flex-col">
      {isOpen && (
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              maxHeight: 0,
              maxWidth: 0,
              minHeight: 0,
              minWidth: 0,
            },
          }}
          initial="hidden"
          animate={{
            opacity: 1,
            minHeight: dropHeight,
            minWidth: dropWidth,
          }}
          exit="hidden"
          className="absolute z-10 mt-1 flex origin-top-right overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-inset ring-neutral-300"
          style={{
            transformOrigin: "top left",
          }}
          transition={{ type: "spring", bounce: 0 }}
        >
          <motion.div layout>
            <DropdownContent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
