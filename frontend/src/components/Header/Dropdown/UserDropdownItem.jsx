export default function UserDropdownItem({
  label,
  textColor = "hover:text-primary",
  onClick,
  Icon,
}) {
  return (
    <li
      onClick={onClick}
      className={`${textColor} cursor-pointer hover:bg-light/70 m-1 grid grid-cols-[1fr_auto] items-center gap-1 rounded-md px-2 py-1.5 duration-300`}
    >
      {label}
      {Icon && <Icon className="h-4 w-4" />}
    </li>
  );
}
