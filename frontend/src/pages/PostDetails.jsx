import PostDetailsBase from "../components/PostDetails/PostDetailsBase";
import { useParams } from "react-router";
import { loadPost } from "../utils/http";

export default function PostDetailsPage() {
  const { id } = useParams();

  return (
    <PostDetailsBase queryKey={["publishedPosts", id]} fetchFn={loadPost} />
  );
}
