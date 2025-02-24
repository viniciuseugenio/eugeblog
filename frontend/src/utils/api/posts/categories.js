import { fetchWithErrorHandling } from "..";
import { API_ENDPOINTS } from "../constants";

export async function fetchCategories() {
  try {
    return await fetchWithErrorHandling(API_ENDPOINTS.CATEGORIES);
  } catch (error) {
    throw new Error(error.message);
  }
}
