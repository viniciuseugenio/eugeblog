import { useEffect, useRef, useState } from "react";

export default function Dropdown({ children, DropdownContent }) {
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
    <div className="relative h-full w-full" ref={dropdownRef}>
      <button
        aria-label="dropdown"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${isOpen ? "bg-accent" : "bg-[#e2d3ca] hover:bg-[#decdc2]"} active:bg-accent h-full cursor-pointer rounded-lg px-4 py-2 duration-300 hover:text-black`}
      >
        {children}
      </button>
      {isOpen && <DropdownContent isOpen={isOpen} />}
    </div>
  );
}
