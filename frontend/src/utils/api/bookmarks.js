import { apiRequest } from ".";
import { API_ENDPOINTS } from "./constants";

export async function getBookmarks(page = 1) {
  try {
    let url = API_ENDPOINTS.BOOKMARKS;

    if (page > 1) {
      url += `?page=${page}`;
    }

    return await apiRequest(url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createBookmark(postId) {
  try {
    return await apiRequest(API_ENDPOINTS.BOOKMARKS, {
      method: "POST",
      body: JSON.stringify({ postId }),
      requiresAuth: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteBookmark(postId) {
  try {
    return await apiRequest(`${API_ENDPOINTS.BOOKMARKS}${postId}/`, {
      method: "DELETE",
      requiresAuth: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
