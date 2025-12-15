import { Skeleton } from "@mui/material";

export default function ItemSkeleton() {
  return (
    <div className="grid w-full grid-cols-[auto_1fr] gap-3">
      <Skeleton variant="rounded" width={96} height={68} />
      <div className="w-full">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </div>
    </div>
  );
}
