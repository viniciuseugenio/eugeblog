export * from "./post.js";
export * from "./bookmarks.js";
export * from "./auth.js";

import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

const { VITE_BASE_BACKEND_URL } = import.meta.env;
const UNEXPECTED_ERROR = "An unexpected error occurred. Please, try again.";

/**
 * Helper function to handle fetch requests with consistent error handling.
 * @param {string} url - The URL to fetch.
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {boolean} [ignore400=false] - If true, 400 errors will not be thrown.
 * @returns {Promise<Object>} - The response data.
 * @throws {Error} - Throws an error if the response is not OK (and not a 400 if ignore400 is true).
 */
export async function fetchWithErrorHandling(
  url,
  options = {},
  ignore400 = false,
) {
  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}${url}`, {
      ...options,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok && !(ignore400 && response.status === 400)) {
      const errorMessage = data.detail || UNEXPECTED_ERROR;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching data to ${url}:`, error);
    throw new Error(error.message);
  }
}
