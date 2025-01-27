const { VITE_BASE_BACKEND_URL } = import.meta.env;
const UNEXPECTED_ERROR =
  "An unexpected error occurred. Please, try again later.";

export async function loadPosts({ currentPage, search }) {
  let url = `${VITE_BASE_BACKEND_URL}/api/posts/`;

  if (currentPage > 1) {
    url += `?page=${currentPage}`;
  }

  if (search) {
    url += `${currentPage > 1 ? "&" : "?"}q=${search}`;
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
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/posts/${id}/`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function editPost({ postId, formData }) {
  if (Array.from(formData.entries()).length === 0) {
    return { detail: "No changes were made." };
  }

  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/posts/${postId}/`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
      },
    );
    const data = await response.json();

    if (!response.ok && response.status !== 400) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function deletePost(id) {
  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/posts/${id}/`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail);
    }

    return { detail: "Post deleted successfully." };
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function loadPostReview(id) {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/posts/review/${id}/`,
      {
        credentials: "include",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function acceptPostReview(id) {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/posts/review/${id}/`,
      { credentials: "include", method: "PATCH" },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function createPost(postData) {
  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/posts/`, {
      method: "POST",
      body: postData,
      credentials: "include",
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
    `${VITE_BASE_BACKEND_URL}/api/posts/${postId}/comments/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: content }),
    },
  );

  if (!response.ok) {
    const error = new Error("Something went wrong while posting comment.");
    error.status = response.status;
    throw error;
  }

  return await response.json();
}

export async function loadComments(postId) {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/posts/${postId}/comments/`,
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
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/posts/categories/`,
    );
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
    let url = `${VITE_BASE_BACKEND_URL}/api/posts/user/`;

    if (page > 1) {
      url += `?page=${page}`;
    }

    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Something went wrong while loading your posts.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}
