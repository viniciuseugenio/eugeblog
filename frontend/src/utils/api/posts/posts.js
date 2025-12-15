import { apiRequest } from "..";
import { API_ENDPOINTS, BACKEND_URL, UNEXPECTED_ERROR } from "../constants";
import { buildApiUrl } from "../helpers"; //

export async function createPost(postData) {
  try {
    return await apiRequest(API_ENDPOINTS.POSTS, {
      method: "POST",
      body: postData,
      requiresAuth: true,
      returnBadRequest: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUserPosts(page) {
  try {
    let url = API_ENDPOINTS.USER_POSTS;

    if (page > 1) {
      url += `?page=${page}`;
    }

    return await apiRequest(url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getPendingPosts(page) {
  try {
    let url = API_ENDPOINTS.POST_REVIEW_LIST;

    if (page > 1) {
      url += `?page=${page}`;
    }

    return await apiRequest(url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getPosts({ currentPage, search }) {
  try {
    let url = API_ENDPOINTS.POSTS;

    if (currentPage > 1) {
      url += `?page=${currentPage}`;
    }

    if (search) {
      url += `${currentPage > 1 ? "&" : "?"}q=${search}`;
    }

    const data = await apiRequest(url);
    return { posts: data.results, pagination: data.pagination };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getPost(id) {
  try {
    const url = buildApiUrl(API_ENDPOINTS.POST, { postId: id });
    return await apiRequest(url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updatePost({ postId, formData }) {
  if (Array.from(formData.entries()).length === 0) {
    return { detail: "No changes were made.", id: "no-changes" };
  }

  try {
    const url = buildApiUrl(API_ENDPOINTS.POST, { postId });
    return await apiRequest(url, {
      method: "PATCH",
      body: formData,
      returnBadRequest: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deletePost(postId) {
  try {
    const url = buildApiUrl(API_ENDPOINTS.POST, { postId });

    const response = await fetch(`${BACKEND_URL}${url}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(response.detail || UNEXPECTED_ERROR);
    }

    return { detail: "Post deleted successfully." };
  } catch (error) {
    throw new Error(error.message);
  }
}
