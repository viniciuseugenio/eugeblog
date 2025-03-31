import { useAuthContext } from "../../../store/auth-context";
import { fetchUserPosts } from "../../../utils/api";
import DropdownList from "./DropdownList";

export default function UserPostsList({ setIsOpen }) {
  const { user } = useAuthContext();
  const userId = user.id;

  return (
    <DropdownList
      label="Your posts"
      queryKey={["archivedPosts", { userId }]}
      queryFn={fetchUserPosts}
      emptyMessage="You have no posts yet."
      setIsOpen={setIsOpen}
    />
  );
}
