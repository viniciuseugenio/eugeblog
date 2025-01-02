export * from "./post.js";
export * from "./bookmarks.js";
export * from "./auth.js";

import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();
