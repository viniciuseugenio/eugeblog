import { fetchPendingPosts } from "../../../utils/api";
import DropdownList from "./DropdownList";

export default function ReviewPostsList() {
  return (
    <DropdownList
      queryKey={["pendingPosts"]}
      queryFn={fetchPendingPosts}
      emptyMessage="No posts for review yet."
      label="Posts for Review"
    />
  );
}
