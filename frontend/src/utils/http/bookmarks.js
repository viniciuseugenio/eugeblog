import { toast } from "sonner";
import { fetchWithToken } from "./auth";

const { VITE_BASE_BACKEND_URL } = import.meta.env;

export async function fetchBookmarks(page = 1) {
  try {
    let url = `${VITE_BASE_BACKEND_URL}/bookmarks/api/list`;

    if (page > 1) {
      url += `?page=${page}`;
    }

    const response = await fetchWithToken(url, {
      method: "GET",
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

export async function addBookmark(
  postId,
  isAuthenticated,
  navigate,
  setIsBookmarked,
) {
  if (!isAuthenticated) {
    toast.info("You need to login to bookmark the post.");
    return navigate(`/login?next=/post/${postId}`);
  }

  try {
    const response = await fetchWithToken(
      `${VITE_BASE_BACKEND_URL}/bookmarks/api/create/${postId}`,
      {
        method: "POST",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data.message || "Something went wrong while bookmarking the post.",
      );
      return;
    }

    toast.success(data.message);
    setIsBookmarked(true);
  } catch {
    toast.error("An unexpected error occurred. Please, try again.");
  }
}

export async function removeBookmark(postId, setIsBookmarked) {
  try {
    const response = await fetchWithToken(
      `${VITE_BASE_BACKEND_URL}/bookmarks/api/delete/${postId}`,
      {
        method: "DELETE",
      },
    );
    const data = await response.json();

    if (!response.ok) {
      toast.error(
        data.message || "Something went wrong while removing the bookmark.",
      );
      return;
    }

    toast.warning(data.message);
    setIsBookmarked(false);
  } catch (err) {
    console.log(err);
    toast.error("An unexpected error occurred. Please, try again.");
  }
}
