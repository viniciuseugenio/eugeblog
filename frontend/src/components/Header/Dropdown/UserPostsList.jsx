import { useAuthContext } from "../../../store/auth-context";
import { fetchUserPosts } from "../../../utils/api";
import DropdownList from "./DropdownList";

export default function UserPostsList({ setIsOpen }) {
  const { userId } = useAuthContext();

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
