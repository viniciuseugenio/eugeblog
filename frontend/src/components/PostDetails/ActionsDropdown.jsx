import { Ellipsis, SquarePen } from "lucide-react";
import CommentDeleteButton from "./CommentDeleteButton";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ActionsDropdown({ commentId, setIsEditing }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonStyle =
    "hover:bg-light hover:text-primary active:bg-accent/70 w-full rounded-md px-2 py-1 text-start duration-300";
  const divRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      // Close dropdown on outside click EXCEPT in the modal
      if (
        divRef &&
        !divRef.current.contains(event.target) &&
        !document.getElementById("modal").contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="relative" ref={divRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <Ellipsis className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={{ hidden: { opacity: 0, y: -10, scale: 0.95 } }}
            initial="hidden"
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit="hidden"
            transition={{ type: "spring", duration: 0.2, bounce: 0 }}
            className="absolute right-1/2 flex w-32 flex-col gap-1 rounded-md border bg-white p-1 shadow-lg"
          >
            <button
              className={buttonStyle}
              onClick={() => {
                setIsEditing(true);
                setIsOpen(false);
              }}
            >
              Edit
            </button>

            <CommentDeleteButton
              buttonStyle={buttonStyle}
              commentId={commentId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
