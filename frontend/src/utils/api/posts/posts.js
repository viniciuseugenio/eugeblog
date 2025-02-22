import { fetchWithErrorHandling } from "..";

export async function createPost(postData) {
  try {
    return await fetchWithErrorHandling(
      `api/posts/`,
      {
        method: "POST",
        body: postData,
      },
      true,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchUserPosts(page) {
  try {
    let url = `/api/posts/user/`;

    if (page > 1) {
      url += `?page=${page}`;
    }

    return await fetchWithErrorHandling(url);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function loadPosts({ currentPage, search }) {
  try {
    let url = "/api/posts/";

    if (currentPage > 1) {
      url += `?page=${currentPage}`;
    }

    if (search) {
      url += `${currentPage > 1 ? "&" : "?"}q=${search}`;
    }

    const data = await fetchWithErrorHandling(url);
    return { posts: data.results, pagination: data.pagination };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function loadPost(id) {
  try {
    return await fetchWithErrorHandling(`/api/posts/${id}/`);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function editPost({ postId, formData }) {
  if (Array.from(formData.entries()).length === 0) {
    return { detail: "No changes were made." };
  }

  try {
    return await fetchWithErrorHandling(
      `/api/posts/${postId}/`,
      {
        method: "PATCH",
        body: formData,
      },
      true, // Do not throw 400 errors;
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deletePost(id) {
  try {
    return await fetchWithErrorHandling(`/api/posts/${id}/`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
