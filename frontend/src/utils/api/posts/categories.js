import { fetchWithErrorHandling } from "..";

export async function fetchCategories() {
  try {
    return await fetchWithErrorHandling("/api/posts/categories/");
  } catch (error) {
    throw new Error(error.message);
  }
}
