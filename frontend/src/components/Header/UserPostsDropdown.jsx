import { useAuth } from "../../store/auth-context";
import { fetchUserPosts } from "../../utils/http";
import DropdownList from "./DropdownList";

export default function UserPostsDropdown() {
  const { userId } = useAuth();

  return (
    <DropdownList
      queryKey={["archivedPosts", { userId }]}
      queryFn={fetchUserPosts}
    />
  );
}
