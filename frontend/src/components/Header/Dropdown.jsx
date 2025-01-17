import { useEffect, useRef, useState } from "react";
import Tooltip from "../Tooltip";

export default function Dropdown({ children, tooltipText, DropdownContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`group relative h-full w-full ${isOpen ? "open" : ""}`}
      ref={dropdownRef}
    >
      <button
        aria-label="dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${isOpen ? "bg-accent" : "bg-[#e2d3ca] hover:bg-[#decdc2]"} active:bg-accent h-full cursor-pointer rounded-lg px-4 py-2 duration-300 hover:text-black`}
      >
        {children}
      </button>

      <Tooltip text={tooltipText} topPosition="top-11" />

      {isOpen && (
        <div className="absolute right-0 top-14 z-10 rounded-md bg-white shadow-2xl">
          <div className="absolute right-5 top-0 h-4 w-4 -translate-y-1/2 rotate-45 bg-white" />
          <DropdownContent isOpen={isOpen} />
        </div>
      )}
    </div>
  );
}
