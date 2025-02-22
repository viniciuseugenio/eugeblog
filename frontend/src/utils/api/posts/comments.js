import { fetchWithErrorHandling } from "..";

export async function loadComments(postId) {
  try {
    return await fetchWithErrorHandling(`/api/posts/${postId}/comments/`);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createComment({ content, postId }) {
  try {
    return await fetchWithErrorHandling(`/api/posts/${postId}/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteComment({ postId, commentId }) {
  try {
    return await fetchWithErrorHandling(
      `/api/posts/${postId}/comments/${commentId}/`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
