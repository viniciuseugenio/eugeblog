import { queryClient } from "./api";

export function invalidatePostListQueries() {
  queryClient.invalidateQueries({
    queryKey: ["publishedPosts"],
    exact: true,
  });
  queryClient.invalidateQueries({
    queryKey: ["pendingPosts"],
    exact: true,
  });
}
