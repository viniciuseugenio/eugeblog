import { useEffect } from "react";
import { defer, json, useActionData, useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import Comments from "../components/PostDetails/Comments";
import PostActions from "../components/PostDetails/PostActions";
import PostMeta from "../components/PostDetails/PostMeta";
import { useAuth } from "../store/auth-context";
import { formatDate } from "../utils/helpers";

export default function PostDetailsPage() {
  const { login, logout, isLogged } = useAuth();
  const { main, comments } = useLoaderData();

  useEffect(() => {
    if (!main.authenticated && isLogged) {
      logout();
    }

    if (main.authenticated && !isLogged) {
      login();
    }
  }, [main.authenticated, isLogged, login, logout]);

  const actionData = useActionData();
  useEffect(() => {
    if (actionData) {
      const toastMethod =
        actionData?.status === 201 ? toast.success : toast.error;
      toastMethod(actionData.message);
    }
  }, [actionData]);

  const createdAt = formatDate(main.post.created_at);
  const image = `http://localhost:8000${main.post.image}`;

  return (
    <>
      <div className="flex flex-col items-center py-24">
        <div className="max-w-[52rem]">
          <div className="flex flex-col items-center">
            <img src={image} className="mb-8 w-[52rem]" alt="" />

            <h1 className="mb-6 max-w-2xl text-center text-4xl font-bold">
              {main.post.title}
            </h1>

            <div className="mb-5 flex gap-4">
              <PostMeta>
                <ion-icon name="person-circle-outline" />
                <span>{main.post.author}</span>
              </PostMeta>

              <PostMeta>
                <ion-icon name="calendar-outline" />
                <span>{createdAt}</span>
              </PostMeta>

              <PostMeta>
                <ion-icon name="pricetag-outline" />
                <span>{main.post.category}</span>
              </PostMeta>
            </div>

            <p className="mb-12 text-center text-stone-700">
              {main.post.excerpt}
            </p>

            <p
              className="mb-6 leading-7"
              dangerouslySetInnerHTML={{ __html: main.post.content }}
            ></p>
          </div>

          <PostActions
            postId={main.post.id}
            canModify={main.has_modify_permission}
            initialIsBookmarked={main.is_bookmarked}
          />

          <Comments
            isAuthenticated={main.authenticated}
            postId={main.post.id}
            comments={comments}
          />
        </div>
      </div>
    </>
  );
}

async function loadPost(id) {
  const response = await fetch(`http://localhost:8000/api/post/${id}`, {
    method: "GET",
    credentials: "include",
  });

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

  const data = await response.json();
  return data.results;
}

export async function loader({ params }) {
  return defer({
    main: await loadPost(params.id),
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
      credentials: "include",
    },
  );

  if (comment.trim().length === 0) {
    return json({ message: "Comment cannot be empty." }, { status: 400 });
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
