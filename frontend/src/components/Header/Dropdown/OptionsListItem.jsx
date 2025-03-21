import { ChevronRight } from "lucide-react";

export default function OptionsListItem({ Icon, label, setOption }) {
  return (
    <li
      onClick={setOption}
      className="hover:text-primary flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm duration-300 hover:bg-[#efe6e1]"
    >
      <Icon size={16} />
      <span>{label}</span>
      <ChevronRight size={16} className="ml-auto" />
    </li>
  );
}
