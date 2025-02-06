import { queryClient } from "./http";

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
