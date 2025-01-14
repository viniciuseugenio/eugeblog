const { VITE_BASE_BACKEND_URL } = import.meta.env;

export async function fetchBookmarks(page = 1) {
  try {
    let url = `${VITE_BASE_BACKEND_URL}/api/bookmarks/`;

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

export async function addBookmark(postId) {
  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/bookmarks/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "An unexpected error occurred. Please, try again.",
    );
  }
}

export async function removeBookmark(postId) {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/bookmarks/${postId}/`,
      {
        credentials: "include",
        method: "DELETE",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while removing the bookmark.",
    );
  }
}
