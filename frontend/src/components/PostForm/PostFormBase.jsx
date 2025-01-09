import PostFormInput from "./Input";
import Editor from "./Editor";
import ImageInput from "./ImageInput";

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
    const formData = new FormData(form);

    mutate(formData);
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
