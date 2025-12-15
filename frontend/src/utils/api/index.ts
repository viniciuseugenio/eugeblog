export * from "./posts";
export * from "./bookmarks.js";
export * from "./auth.js";

import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

import { BACKEND_URL, UNEXPECTED_ERROR } from "./constants";
import { refreshToken } from "./auth.js";

interface FetchOptions extends RequestInit {
  returnBadRequest?: boolean;
  requiresAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {},
  _isRetry: boolean = false,
): Promise<T> {
  const {
    requiresAuth = false,
    returnBadRequest = false,
    ...fetchOptions
  } = { ...options };
  const url = `${BACKEND_URL}${endpoint}`;

  const config: RequestInit = {
    ...fetchOptions,
    credentials: "include",
    headers: {
      ...(!(fetchOptions.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...fetchOptions.headers,
    },
  };

  let response = await fetch(url, config);

  if (response.status === 401 && requiresAuth && !_isRetry) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return apiRequest(endpoint, options, true);
    } else {
      throw new Error("Authentication required");
    }
  }

  let data;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }
  } else {
    data = {};
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error("An error occurred on the server");
    }

    if (response.status === 400 && returnBadRequest) {
      return data;
    }

    const errorMessage = data?.detail || data?.message || UNEXPECTED_ERROR;
    throw new Error(errorMessage);
  }

  return data;
}
