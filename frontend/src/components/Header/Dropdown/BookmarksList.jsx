import { fetchBookmarks } from "../../../utils/api";
import { useAuthContext } from "../../../store/auth-context";
import DropdownList from "./DropdownList";

export default function BookmarksList({ setIsOpen }) {
  const { userId } = useAuthContext();

  return (
    <DropdownList
      label="Bookmarks"
      queryKey={["bookmarks", { userId }]}
      queryFn={fetchBookmarks}
      emptyMessage="You have no bookmarks yet."
      setIsOpen={setIsOpen}
    />
  );
}
