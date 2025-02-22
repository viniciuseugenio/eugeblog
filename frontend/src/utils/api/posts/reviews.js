import { fetchWithErrorHandling } from "..";

const { VITE_BASE_BACKEND_URL } = import.meta.env;

export async function loadPostReview(id) {
  try {
    return await fetchWithErrorHandling(`/api/posts/${id}/review/`);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function acceptPostReview(id) {
  try {
    return await fetchWithErrorHandling(`/api/posts/${id}/review/accept/`, {
      method: "POST",
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function loadPendingAndPublishedPost(postId) {
  try {
    const publishedPosts = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/posts/${postId}/`,
    );

    if (publishedPosts.ok) {
      const publishedData = await publishedPosts.json();
      return publishedData;
    }

    const pendingPosts = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/posts/${postId}/review/`,
      {
        credentials: "include",
      },
    );

    if (pendingPosts.ok) {
      const pendingData = await pendingPosts.json();
      return pendingData;
    }

    throw new Error("No post was found with the provided ID.");
  } catch (error) {
    throw new Error(error.message);
  }
}
