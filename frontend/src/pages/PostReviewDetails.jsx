import { useParams } from "react-router";
import { loadPostReview } from "../utils/api";
import PostDetailsBase from "../components/PostDetails/PostDetailsBase";

export default function PostReviewDetailsPage() {
  const { id } = useParams();

  return (
    <PostDetailsBase
      queryKey={["pendingPosts", id]}
      fetchFn={loadPostReview}
      isReview
    />
  );
}
