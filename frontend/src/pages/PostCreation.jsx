import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import PostFormBase from "../components/PostForm/PostFormBase";
import { useAuthCheck } from "../utils/hooks";
import { createPost } from "../utils/api";
import { ERROR_MESSAGES } from "../utils/constants";

export default function PostCreationPage() {
  const navigate = useNavigate();
  const { data: authData } = useAuthCheck();

  useEffect(() => {
    if (authData && !authData.isAuthenticated) {
      toast.error("You must be logged in to create a post.", {
        id: "login-required",
      });
      navigate("/login?next=/post/create");
    }
  }, [authData, navigate]);

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      if (data.errors) {
        toast.error(ERROR_MESSAGES.FORM_ERROR);
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, [100]);
        return;
      }

      toast.success("Good news! The post was now sent to review!", {
        id: "post-created",
        description:
          "Now, our post reviewers will see if it is good to be published.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message, { id: "post-creation-error" });
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, [100]);
    },
  });

  return (
    <PostFormBase
      mutationData={data}
      isError={isError}
      isPending={isPending}
      mutate={mutate}
      title="Create New Post"
    />
  );
}
