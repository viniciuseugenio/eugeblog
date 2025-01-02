import { useAuthContext } from "../../store/auth-context";
import { fetchUserPosts } from "../../utils/http";
import DropdownList from "./DropdownList";

export default function UserPostsDropdown() {
  const { userId } = useAuthContext();

  return (
    <DropdownList
      queryKey={["archivedPosts", { userId }]}
      queryFn={fetchUserPosts}
    />
  );
}
