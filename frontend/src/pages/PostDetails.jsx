import PostDetailsBase from "../components/PostDetails/PostDetailsBase";
import { useParams } from "react-router";
import { getPost } from "../utils/api";
import Comments from "../components/PostDetails/Comments.jsx";

export default function PostDetailsPage() {
  const { id } = useParams();

  return (
    <main className="container mx-auto px-4 py-8">
      <PostDetailsBase queryKey={["publishedPosts", id]} fetchFn={getPost} />

      <section className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-xl bg-white shadow-sm ">
        <Comments />
      </section>
    </main>
  );
}
