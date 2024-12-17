import PostCreationInput from "../components/PostCreation/Input";
import ImageInput from "../components/PostCreation/ImageInput";
import Editor from "../components/PostCreation/Editor";
import { useAuth } from "../store/auth-context";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../utils/http";

export default function PostCreationPage() {
  const navigate = useNavigate();
  const { isLogged } = useAuth();

  useEffect(() => {
    if (!isLogged) {
      toast.error("You must be logged in to create a post.", {
        id: "login-required",
      });
      navigate("/login?next=/post/create");
    }
  }, []);

  const { mutate, data, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: createPost,
  });

  if (isError) {
    toast.error(error.message, { id: "post-creation-error" });
  }

  if (isSuccess && !data.errors) {
    toast.success("Good news! The post was now sent to review!", {
      id: "post-created",
      description:
        "Now, our post reviewers will see if it is good to be published.",
    });
    navigate("/");
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    mutate(formData);
  }

  return (
    <div className="my-12 flex min-h-full flex-1 items-center justify-center">
      <div className="border-light max-w-[56rem] rounded-md border p-8">
        <h1 className="text-3xl">So, lets create a new post!</h1>
        <p>
          Fill all required fields and submit your article so everyone can have
          access to a bit of your knowledge.
        </p>

        <hr className="my-6" />

        <form
          method="POST"
          onSubmit={handleFormSubmit}
          className="grid grid-cols-2 gap-6"
        >
          <PostCreationInput
            label="Title"
            name="title"
            id="id_title"
            errors={data?.errors?.title}
            required
          />
          <PostCreationInput
            label="Excerpt"
            name="excerpt"
            id="id_excerpt"
            errors={data?.errors?.excerpt}
            required
          />
          <Editor errors={data?.errors?.content} />
          <PostCreationInput
            label="Category"
            name="category"
            id="id_category"
            type="select"
            errors={data?.errors?.category}
            required
          />
          <ImageInput errors={data?.errors?.image} />

          <div className="col-span-2 flex gap-3 justify-self-end">
            <button
              type="reset"
              className="rounded-md px-8 py-2 text-red-600 ring-1 ring-inset ring-red-600 duration-300 hover:text-red-300 hover:ring-red-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-light ring-primary grow-0 rounded-md px-8 py-2 duration-300 hover:bg-[#5b4a3e] active:ring-1"
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
