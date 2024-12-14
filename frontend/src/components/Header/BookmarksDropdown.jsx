import { fetchBookmarks } from "../../utils/http";
import { useAuth } from "../../store/auth-context";
import DropdownList from "./DropdownList";

export default function BookmarksDropdown() {
  const { userId } = useAuth();

  return (
    <DropdownList
      queryKey={["bookmarks", { userId }]}
      queryFn={fetchBookmarks}
    />
  );
}
