import { Skeleton } from "@mui/material";
import CommetItemSkeleton from "./CommentItemSkeleton";

export default function CommentsSkeleton() {
  return (
    <>
      <div className="mb-6 flex gap-2">
        <Skeleton width={20} height={24} />
        <Skeleton width={136} height={26} />
      </div>

      <div>
        <Skeleton
          variant="rectangular"
          height={28}
          width="100%"
          sx={{ mb: "8px" }}
        />
        <div className="mb-6 flex justify-end gap-3">
          <Skeleton variant="rounded" height={40} width={128} />
          <Skeleton variant="rounded" height={40} width={128} />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <CommetItemSkeleton />
        <CommetItemSkeleton />
      </div>
    </>
  );
}
