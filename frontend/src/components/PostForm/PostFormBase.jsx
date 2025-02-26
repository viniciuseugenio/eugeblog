import PostFormInput from "./Input";
import Editor from "./Editor";
import ImageInput from "./ImageInput";
import PrimaryButton from "../PrimaryButton";

export default function PostFormBase({
  queryData,
  mutationData,
  postId,
  isPending,
  mutate,
  title,
  description,
}) {
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
    <div className="my-12 flex min-h-full flex-1 items-center justify-center">
      <div className="border-light max-w-[56rem] rounded-md border p-8">
        <h1 className="text-3xl">{title}</h1>
        <p>{description}</p>

        <hr className="my-6" />

        <form
          method="POST"
          onSubmit={handleFormSubmit}
          className="grid grid-cols-2 gap-6"
        >
          <PostFormInput
            key={queryData?.post?.title}
            label="Title"
            name="title"
            id="id_title"
            data={queryData?.post?.title}
            errors={mutationData?.errors?.title}
            required
          />
          <PostFormInput
            key={queryData?.post?.excerpt}
            label="Excerpt"
            name="excerpt"
            id="id_excerpt"
            data={queryData?.post?.excerpt}
            errors={mutationData?.errors?.excerpt}
            required
          />
          <Editor
            key={queryData?.post?.content}
            data={queryData?.post?.content}
            errors={mutationData?.errors?.content}
          />
          <PostFormInput
            key={queryData?.post?.category}
            label="Category"
            name="category"
            id="id_category"
            type="select"
            data={queryData?.post?.category}
            errors={mutationData?.errors?.category}
            required
          />
          <ImageInput
            key={queryData?.post?.image}
            data={queryData?.post?.image}
            errors={mutationData?.errors?.image}
          />

          <div className="col-span-2 flex gap-3 justify-self-end">
            <button
              onClick={() => window.history.back()}
              type="reset"
              className="grow-0 rounded-md px-10 py-1 text-red-800 ring-1 ring-inset ring-red-300 duration-300 hover:bg-red-200 hover:ring-red-300 active:bg-red-300"
            >
              Cancel
            </button>

            <PrimaryButton
              text="Send Post"
              isPending={isPending}
              className="px-8"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
