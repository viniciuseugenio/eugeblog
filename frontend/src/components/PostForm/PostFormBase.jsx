import PostFormInput from "./Input";
import Editor from "./Editor";
import ImageInput from "./ImageInput";
import PrimaryButton from "../PrimaryButton";
import NeutralButton from "../NeutralButton";
import { useNavigate } from "react-router";
import SelectCategory from "./SelectCategory";

export default function PostFormBase({
  queryData,
  mutationData,
  postId,
  isPending,
  mutate,
  title,
}) {
  const navigate = useNavigate();

  function handleCancel() {
    const reviewStatus = queryData?.post?.review_status;
    if (postId) {
      const url =
        reviewStatus === "A" ? `/post/${postId}` : `/post/review/${postId}`;
      return navigate(url);
    }

    return navigate("/");
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form); // Collects all form data
    const changedData = new FormData(); // Store only changed data

    const image = formData.get("image");
    if (image instanceof File && image.name) {
      changedData.append("image", image);
    }

    for (const [key, value] of formData.entries()) {
      if (!value || !queryData?.post[key]) continue;

      if (key === "category") {
        const categoryId = Number(value);
        if (!isNaN(categoryId) && categoryId !== queryData?.post.category.id) {
          changedData.append(key, categoryId);
        }
      } else if (key !== "image" && queryData?.post[key] !== value) {
        changedData.append(key, value);
      }
    }

    postId ? mutate({ postId, formData: changedData }) : mutate(formData);
  }

  return (
    <div className="container mx-auto my-8 max-w-xl rounded-xl bg-white p-6 shadow-sm sm:mx-auto sm:max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-800">{title}</h1>

      <form method="POST" onSubmit={handleFormSubmit} className="space-y-6">
        <PostFormInput
          key={queryData?.post?.title}
          label="Title"
          name="title"
          id="id_title"
          placeholder="Enter post title"
          data={queryData?.post?.title}
          errors={mutationData?.errors?.title}
          required
        />

        <PostFormInput
          key={queryData?.post?.excerpt}
          label="Excerpt"
          name="excerpt"
          id="id_excerpt"
          type="textarea"
          placeholder="Brief summary of your post"
          data={queryData?.post?.excerpt}
          errors={mutationData?.errors?.excerpt}
          helpText="A short description that appears in post previews (150-200 characters recommended)"
          required
        />

        <SelectCategory
          value={queryData?.post?.category}
          name="category"
          id="category"
          errors={mutationData?.errors?.category}
        />

        <ImageInput
          key={queryData?.post?.image}
          data={queryData?.post?.image}
          errors={mutationData?.errors?.image}
          helpText="Recommended size: 1366x720px"
        />

        <Editor
          key={queryData?.post?.content}
          data={queryData?.post?.content}
          errors={mutationData?.errors?.content}
        />

        <div className="ml-auto flex w-max gap-3">
          <NeutralButton onClick={handleCancel} label="Cancel" />

          <PrimaryButton
            label="Publish Post"
            disabled={isPending}
            className="self-end px-4 text-sm font-medium"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
