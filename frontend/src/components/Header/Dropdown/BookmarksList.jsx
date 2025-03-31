import { fetchBookmarks } from "../../../utils/api";
import { useAuthContext } from "../../../store/auth-context";
import DropdownList from "./DropdownList";

export default function BookmarksList({ setIsOpen }) {
  const { user } = useAuthContext();
  const userId = user.id;

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
