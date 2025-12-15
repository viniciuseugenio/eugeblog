import { apiRequest } from "..";
import { API_ENDPOINTS } from "../constants";

export async function getCategories() {
  try {
    return await apiRequest(API_ENDPOINTS.CATEGORIES);
  } catch (error) {
    throw new Error(error.message);
  }
}
