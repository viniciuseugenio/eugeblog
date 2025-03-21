import { Skeleton } from "@mui/material";
import { CircleUser } from "lucide-react";

export default function CommentItemSkeleton() {
  return (
    <div className="group grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] rounded-md border-b px-2 py-1 pb-6 duration-300 last:border-0">
      <span className="row-span-2 mr-2 self-start p-1">
        <Skeleton variant="circular" width={32} height={32} />
      </span>
      <div className="col-span-2 mb-3 flex items-center justify-between gap-1">
        <div>
          <Skeleton width={120} height={24} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton width={16} height={16} />
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton variant="rectangular" height={16} width="100%" />
        <Skeleton variant="rectangular" height={16} width="40%" />
      </div>
    </div>
  );
}
