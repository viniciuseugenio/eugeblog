import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function PaginationIcon({ isPrevious }) {
  return (
    <>
      {isPrevious ? (
        <ChevronLeftIcon size={18} />
      ) : (
        <ChevronRightIcon size={18} />
      )}
    </>
  );
}
