import PostDetailsBase from "./PostDetails.jsx";
import { useParams } from "react-router-dom";
import { loadPost } from "../utils/http";

export default function PostDetailsPage() {
  const { id } = useParams();

  return <PostDetailsBase queryKey={["post", id]} fetchFn={loadPost} />;
}
