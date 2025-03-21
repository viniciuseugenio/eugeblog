import { Archive, ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import IconSpan from "../IconSpan.jsx";
import OptionsDropdown from "./OptionsDropdown.jsx";

export default function DropdownButton() {
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef && !divRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div ref={divRef} className="relative">
      <button
        aria-label="dropdown"
        className={`${isOpen ? "bg-accent" : "hover:bg-[#e2d3ca]"} active:bg-accent min-w-28 group flex h-full w-full cursor-pointer gap-2 rounded-lg px-4 py-2 duration-500 hover:text-black`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IconSpan>
          <Archive size={18} />
        </IconSpan>

        <p className="text-sm">Posts</p>

        <IconSpan isOpen={isOpen} className="ml-auto">
          <ChevronDownIcon size={15} />
        </IconSpan>
      </button>

      <OptionsDropdown isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
