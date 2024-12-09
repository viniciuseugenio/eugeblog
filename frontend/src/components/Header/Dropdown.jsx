import { useState } from "react";

export default function Dropdown({ children, DropdownContent }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="relative h-fit w-fit rounded-lg bg-[#D6C0B3] px-4 py-2 duration-300 hover:text-[#5b4a3e]"
    >
      <div className="flex items-center justify-center gap-1 font-medium">
        {children}
        <ion-icon
          name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
        />
      </div>
      {isOpen && <DropdownContent isOpen={isOpen} />}
    </div>
  );
}
