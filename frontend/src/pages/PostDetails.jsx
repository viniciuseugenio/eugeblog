import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PostDetailsBase from "../components/PostDetails/PostDetailsBase.jsx";
import { useAuthCheck } from "../utils/hooks.js";
import { loadPost } from "../utils/http";

export default function PostDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => loadPost(params.id),
    onError: (error) => {
      toast.error(error.message, {
        id: "post-error",
      });
      navigate("/");
    },
  });

  useAuthCheck();

  return (
    <>
      <div className="flex flex-col items-center py-24">
        <div className="max-w-[52rem]">
          {isPending && <CircularProgress size="4rem" color="#493628" />}
          {data && (
            <PostDetailsBase
              post={data.post}
              hasModifyPermission={data.has_modify_permission}
              isBookmarked={data.is_bookmarked}
            />
          )}
        </div>
      </div>
    </>
  );
}
