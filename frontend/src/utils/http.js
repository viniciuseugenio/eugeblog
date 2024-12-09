import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const { VITE_BASE_BACKEND_URL } = import.meta.env;

export const queryClient = new QueryClient();

export async function loadPosts(currentPage) {
  console.log("executing query, page:", currentPage);

  let url = `${VITE_BASE_BACKEND_URL}/api/posts/`;
  if (currentPage > 1) {
    url += `?page=${currentPage}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("Something went wrong while loading the posts.");
    error.info = {
      message: "We are very sorry for this, please, try again later.",
    };
    throw error;
  }

  const data = await response.json();

  return {
    posts: data.results,
    pagination: data.pagination,
  };
}

export async function loadPost(id) {
  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/post/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "An unexpected error occurred. Please, try again later.",
    );
  }
}

export async function fetchBookmarks(page = 1) {
  try {
    let url = `${VITE_BASE_BACKEND_URL}/bookmarks/api/list`;

    if (page > 1) {
      url += `?page=${page}`;
    }

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch bookmarks");
    }

    return data;
  } catch {
    throw new Error("An unexpected error occurred. Please, try again.");
  }
}

export async function addBookmark(
  postId,
  isAuthenticated,
  navigate,
  setIsBookmarked,
) {
  if (!isAuthenticated) {
    toast.info("You need to login to bookmark the post.");
    return navigate(`/login?next=/post/${postId}`);
  }

  try {
    const response = await fetch(
      `http://localhost:8000/bookmarks/api/create/${postId}`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data.message || "Something went wrong while bookmarking the post.",
      );
      return;
    }

    toast.success(data.message);
    setIsBookmarked(true);
  } catch {
    toast.error("An unexpected error occurred. Please, try again.");
  }
}

export async function removeBookmark(postId, setIsBookmarked) {
  try {
    const response = await fetch(
      `http://localhost:8000/bookmarks/api/delete/${postId}`,
      {
        method: "delete",
        credentials: "include",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data.message || "Something went wrong while removing the bookmark.",
      );
      return;
    }

    toast.warning(data.message);
    setIsBookmarked(false);
  } catch (err) {
    console.log(err);
    toast.error("An unexpected error occurred. Please, try again.");
  }
}

export async function createComment({ content, postId }) {
  const response = await fetch(
    `${VITE_BASE_BACKEND_URL}/api/post/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: content }),
      credentials: "include",
    },
  );

  if (!response.ok) {
    const error = new Error("Something went wrong while posting comment.");
    error.status = response.status;
    throw error;
  }

  return await response.json();
}

export async function loadComments(id) {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/post/${id}/comments`,
    );

    if (!response.ok) {
      throw new Error("Something went wrong while loading comments.");
    }

    const data = await response.json();
    return data.results;
  } catch {
    throw new Error("An unexpected error occurred. Please, try again later.");
  }
}
