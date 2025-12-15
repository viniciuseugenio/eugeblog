import { apiRequest } from "..";
import { API_ENDPOINTS } from "../constants";
import { buildApiUrl } from "../helpers";

const { VITE_BASE_BACKEND_URL } = import.meta.env;

export async function getPostReview(postId) {
  try {
    const url = buildApiUrl(API_ENDPOINTS.POST_REVIEW, { postId });
    return await apiRequest(url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function acceptPostReview(postId) {
  try {
    const url = buildApiUrl(API_ENDPOINTS.POST_REVIEW_ACCEPT, { postId });
    return await apiRequest(url, {
      method: "POST",
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getPendingAndPublishedPost(postId) {
  try {
    const publishedUrl = buildApiUrl(API_ENDPOINTS.POST, { postId });
    const publishedPosts = await fetch(
      `${VITE_BASE_BACKEND_URL}${publishedUrl}`,
    );

    if (publishedPosts.ok) {
      const publishedData = await publishedPosts.json();
      return publishedData;
    }

    const pendingUrl = buildApiUrl(API_ENDPOINTS.POST_REVIEW, { postId });
    const pendingPosts = await fetch(`${VITE_BASE_BACKEND_URL}${pendingUrl}`, {
      credentials: "include",
    });

    if (pendingPosts.ok) {
      const pendingData = await pendingPosts.json();
      return pendingData;
    }

    throw new Error("No post was found with the provided ID.");
  } catch (error) {
    throw new Error(error.message);
  }
}
