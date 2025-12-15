import { useAuthContext } from "../../../store/auth-context";
import { getCurrentUserPosts } from "../../../utils/api";
import DropdownList from "./DropdownList";

export default function UserPostsList({ setIsOpen }) {
  const { user } = useAuthContext();
  const userId = user.id;

  return (
    <DropdownList
      label="Your posts"
      queryKey={["archivedPosts", { userId }]}
      queryFn={getCurrentUserPosts}
      emptyMessage="You have no posts yet."
      setIsOpen={setIsOpen}
    />
  );
}
