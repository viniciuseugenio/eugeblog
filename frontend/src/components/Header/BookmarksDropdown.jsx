import { fetchBookmarks } from "../../utils/http";
import { useAuthContext } from "../../store/auth-context";
import DropdownList from "./DropdownList";

export default function BookmarksDropdown() {
  const { userId } = useAuthContext();

  return (
    <DropdownList
      queryKey={["bookmarks", { userId }]}
      queryFn={fetchBookmarks}
      emptyMessage="You have no bookmarks yet."
    />
  );
}
