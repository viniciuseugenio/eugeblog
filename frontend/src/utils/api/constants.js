export const { VITE_BASE_BACKEND_URL: BACKEND_URL } = import.meta.env;

export const UNEXPECTED_ERROR =
  "An unexpected error occurred. Please, try again.";
export const API_ENDPOINTS = {
  CATEGORIES: "/api/categories/",
  TOKEN_REFRESH: "/api/token/refresh/",
  TOKEN_VERIFY: "/api/token/verify/",
  LOGIN: "/api/token/",
  SIGNUP: "/api/accounts/signup/",
  LOGOUT: "/api/accounts/logout/",
  PASSWORD_RESET: "/api/accounts/password-reset/",
  PASSWORD_RESET_SET: "/api/accounts/password-reset/set/",
  BOOKMARKS: "/api/bookmarks/",
  COMMENTS: "/api/posts/:postId/comments/",
  COMMENT: "/api/posts/comments/:commentId/",
  POSTS: "/api/posts/",
  POST: "/api/posts/:postId/",
  USER_POSTS: "/api/posts/user/",
  POST_REVIEW: "/api/posts/:postId/review/",
  POST_REVIEW_ACCEPT: "/api/posts/:postId/review/accept/",
};
