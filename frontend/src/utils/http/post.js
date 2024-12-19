const { VITE_BASE_BACKEND_URL } = import.meta.env;
const UNEXPECTED_ERROR =
  "An unexpected error occurred. Please, try again later.";

export async function loadPosts(currentPage) {
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
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function createPost(postData) {
  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/post/create`, {
      method: "POST",
      credentials: "include",
      body: postData,
    });
    const data = await response.json();

    if (!response.ok && response.status !== 400) {
      throw new Error(UNEXPECTED_ERROR);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
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
    throw new Error(UNEXPECTED_ERROR);
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/categories/`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "It was not possible to load the categories.",
      );
    }

    return data.results;
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function fetchUserPosts(page) {
  try {
    let url = `${VITE_BASE_BACKEND_URL}/api/posts/user`;

    if (page > 1) {
      url += `?page=${page}`;
    }

    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = "Something went wrong while loading your posts.";

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {}

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}
