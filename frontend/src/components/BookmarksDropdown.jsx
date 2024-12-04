import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchBookmarks } from "../utils/http";
import BookmarkItem from "./BookmarkItem";

export default function BookmarksDropdown() {
  const { data, isError, isPending, error } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  });

  return (
    <div className="absolute right-0 top-14 bg-white shadow-xl">
      <div className="absolute -top-6 h-6 w-full bg-transparent" />
      <div className="absolute right-16 top-0 h-4 w-4 -translate-y-1/2 rotate-45 bg-white" />
      <div className="flex w-96 items-center justify-center p-4">
        {isPending ? (
          <CircularProgress color="#493628" />
        ) : isError ? (
          <p className="flex items-center justify-center gap-1 text-red-500">
            <span className="flex items-center justify-center text-xl">
              <ion-icon name="alert-circle-outline"></ion-icon>
            </span>
            {error.message}
          </p>
        ) : data.length > 0 ? (
          <ul className="flex flex-col gap-y-6">
            {data.map((bookmark) => (
              <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
          </ul>
        ) : (
          <p className="text-center">No bookmarks available.</p>
        )}
      </div>
    </div>
  );
}
