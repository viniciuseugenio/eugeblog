import { fetchWithErrorHandling } from ".";

export async function fetchBookmarks(page = 1) {
  try {
    let url = `/api/bookmarks/`;

    if (page > 1) {
      url += `?page=${page}`;
    }

    return await fetchWithErrorHandling(url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function addBookmark(postId) {
  try {
    return await fetchWithErrorHandling("/api/bookmarks/", {
      method: "POST",
      body: JSON.stringify({ postId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function removeBookmark(postId) {
  try {
    return await fetchWithErrorHandling(`/api/bookmarks/${postId}/`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
