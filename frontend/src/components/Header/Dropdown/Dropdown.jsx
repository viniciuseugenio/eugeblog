import { motion } from "motion/react";
import { useContext } from "react";
import { OptionsContext } from "./UserDropdown";

export default function Dropdown({ children }) {
  const { dropdownPage, DROPDOWN_PAGES } = useContext(OptionsContext);
  const isHome = dropdownPage == DROPDOWN_PAGES.HOME;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -10, scale: 0.9 },
      }}
      initial="hidden"
      layout
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        minHeight: isHome ? "156px" : "620px",
        minWidth: isHome ? "208px" : "418px",
      }}
      exit="hidden"
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="min-w-52 z-10 right-0 mt-1 origin-top-right absolute rounded-md border bg-white text-sm shadow-md overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
