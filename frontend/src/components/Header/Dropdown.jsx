import { useEffect, useRef, useState } from "react";
import IconSpan from "./IconSpan";

export default function Dropdown({ DropdownContent, icon, label }) {
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
        className={`${isOpen ? "bg-accent" : "hover:bg-[#e2d3ca]"} active:bg-accent group flex h-full cursor-pointer gap-3 rounded-lg px-4 py-2 duration-300 hover:text-black`}
      >
        <IconSpan>
          <ion-icon name={icon} />
        </IconSpan>

        <p className="text-sm">{label}</p>

        <IconSpan isOpen={isOpen} size="sm">
          <ion-icon name="chevron-down-outline"></ion-icon>
        </IconSpan>
      </button>

      {isOpen && (
        <div className="border-accent absolute top-14 z-10 flex min-h-[44rem] min-w-[26rem] flex-col rounded-md border bg-white shadow-lg">
          <div className="border-accent dropdown-clip absolute left-16 top-0 h-4 w-4 -translate-y-1/2 rotate-45 border bg-white" />
          <DropdownContent isOpen={isOpen} />
        </div>
      )}
    </div>
  );
}
