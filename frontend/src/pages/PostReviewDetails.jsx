import { useParams } from "react-router";
import { getPostReview } from "../utils/api";
import PostDetailsBase from "../components/PostDetails/PostDetailsBase";

export default function PostReviewDetailsPage() {
  const { id } = useParams();

  return (
    <main className="container mx-auto px-4 py-8">
      <PostDetailsBase
        queryKey={["pendingPosts", id]}
        fetchFn={getPostReview}
        isReview
      />
    </main>
  );
}
