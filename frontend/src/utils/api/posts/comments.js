import { fetchWithErrorHandling } from "..";
import { buildApiUrl } from "../helpers";
import { API_ENDPOINTS } from "../constants";

export async function loadComments(postId) {
  try {
    const url = buildApiUrl(API_ENDPOINTS.COMMENTS, { postId });
    return await fetchWithErrorHandling(url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createComment({ content, postId }) {
  try {
    const url = buildApiUrl(API_ENDPOINTS.COMMENTS, { postId });
    return await fetchWithErrorHandling(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
      true,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateComment({ content, commentId }) {
  try {
    const url = buildApiUrl(API_ENDPOINTS.COMMENT, { commentId });
    return await fetchWithErrorHandling(
      url,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
      true,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteComment(commentId) {
  try {
    const url = buildApiUrl(API_ENDPOINTS.COMMENT, { commentId });
    return await fetchWithErrorHandling(url, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
