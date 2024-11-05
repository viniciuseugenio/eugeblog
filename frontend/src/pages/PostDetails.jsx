import { toast } from "sonner";
import { useLoaderData, useActionData, defer, json } from "react-router-dom";
import PostMeta from "../components/PostDetails/PostMeta";
import Comments from "../components/PostDetails/Comments";
import { formatDate } from "../utils/helpers";
import { useEffect } from "react";

export default function PostDetailsPage() {
  const { post, comments } = useLoaderData();
  const actionData = useActionData();

  useEffect(() => {
    if (actionData) {
      const toastMethod =
        actionData?.status === 201 ? toast.success : toast.error;
      toastMethod(actionData.message);
    }
  }, [actionData]);

  const createdAt = formatDate(post.created_at);

  return (
    <div className="flex flex-col items-center py-24">
      <div className="max-w-[52rem]">
        <div className="flex flex-col items-center">
          <img src={post.image} className="mb-8 w-[52rem]" alt="" />

          <h1 className="mb-6 max-w-2xl text-center text-4xl font-bold">
            {post.title}
          </h1>

          <div className="mb-5 flex gap-4">
            <PostMeta>
              <ion-icon name="person-circle-outline" />
              <span>{post.author}</span>
            </PostMeta>

            <PostMeta>
              <ion-icon name="calendar-outline" />
              <span>{createdAt}</span>
            </PostMeta>

            <PostMeta>
              <ion-icon name="pricetag-outline" />
              <span>{post.category}</span>
            </PostMeta>
          </div>

          <p className="mb-12 text-center text-stone-700">{post.excerpt}</p>

          <p
            className="mb-6 leading-7"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></p>
        </div>

        <div className="mb-12">
          <button className="flex items-center gap-1 text-base duration-300 hover:text-[#5b4a3e]">
            <ion-icon name="bookmark-outline"></ion-icon>
            <span>Bookmark</span>
          </button>
        </div>

        <Comments comments={comments} />
      </div>
    </div>
  );
}

async function loadPost(id) {
  const response = await fetch(`http://localhost:8000/api/post/${id}`);

  if (!response.ok) {
    throw json(
      { message: "Something went wrong while loading post." },
      { status: response.status },
    );
  }

  return await response.json();
}

async function loadComments(id) {
  const response = await fetch(`http://localhost:8000/api/post/${id}/comments`);

  if (!response.ok) {
    throw json(
      { message: "Something went wrong while loading comments." },
      { status: response.status },
    );
  }

  return await response.json();
}

export async function loader({ params }) {
  return defer({
    post: await loadPost(params.id),
    comments: loadComments(params.id),
  });
}

export async function action({ request, params }) {
  const data = await request.formData();
  const comment = data.get("content");

  const response = await fetch(
    `http://localhost:8000/api/post/${params.id}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    },
  );

  if (comment.trim().length === 0) {
    return json({ message: "Comment cannot be empty." }, { status: 200 });
  }

  if (!response.ok) {
    return json(
      { message: "Something went wrong while posting comment." },
      { status: response.status },
    );
  }

  return json(
    { message: "Comment posted successfully.", status: 201 },
    { status: 201 },
  );
}
