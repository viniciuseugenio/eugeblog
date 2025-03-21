import { CircleUser } from "lucide-react";
import { Skeleton } from "@mui/material";

export default function PostDetailsSkeleton() {
  return (
    <article className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-sm">
      <Skeleton
        variant="rectangular"
        className="mb-3 rounded-t-md"
        height="500px"
      />

      <div className="flex flex-col p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <Skeleton
            variant="text"
            sx={{ borderRadius: "999px" }}
            width={80}
            height="24px"
          />

          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={80} />
        </div>

        <div className="mb-6 flex flex-col gap-1">
          <Skeleton variant="rounded" width="100%" height="44px" />
          <Skeleton variant="rounded" width="70%" height="44px" />
        </div>

        <div className="mb-8 flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div>
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={150} height={20} />
          </div>
        </div>

        <div className="mb-8 flex justify-between border-b pb-8 ">
          <div className="flex gap-4">
            <Skeleton variant="rectangular" width={60} height={20} />
            <Skeleton variant="rectangular" width={60} height={20} />
          </div>

          <Skeleton variant="rectangular" width={80} height={20} />
        </div>

        <div>
          <Skeleton variant="text" width="100%" height="30px" />
          <Skeleton variant="text" width="100%" height="30px" />
          <Skeleton variant="text" width="60%" height="30px" />

          <Skeleton variant="text" width="50%" height="60px" />
          <Skeleton variant="text" width="100%" height="30px" />
          <Skeleton variant="text" width="100%" height="30px" />
          <Skeleton variant="text" width="80%" height="30px" />
          <Skeleton variant="text" width="100%" height="30px" />

          <Skeleton variant="text" width="50%" height="60px" />
          <Skeleton variant="text" width="100%" height="30px" />
          <Skeleton variant="text" width="100%" height="30px" />
          <Skeleton variant="text" width="80%" height="30px" />
        </div>
      </div>
    </article>
  );
}
