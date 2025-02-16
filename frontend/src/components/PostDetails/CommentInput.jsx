import { useEffect, useRef, useState } from "react";

export default function CommentInput({ isPending, isSuccess }) {
  const textArea = useRef();
  const [value, setValue] = useState("");

  function handleChange(event) {
    setValue(event.target.value);
  }

  useEffect(() => {
    textArea.current.style.height = "auto";
    textArea.current.style.height = textArea.current.scrollHeight + "px";
  }, [value]);

  return (
    <div className="group/div">
      <textarea
        ref={textArea}
        name="content"
        id="content"
        rows={1}
        value={value}
        placeholder="Add a comment..."
        onChange={handleChange}
        className="mb-2 w-full border-b border-[#AB886D] pb-1 outline-none duration-300 focus:border-[#493628]"
      />

      <div className="mb-6 flex justify-end">
        <div className="invisible flex origin-center scale-0 transform gap-3 opacity-0 duration-300 ease-in-out group-focus-within/div:visible group-focus-within/div:scale-100 group-focus-within/div:opacity-100">
          <button
            type="reset"
            onClick={() => {
              setValue("");
              document.activeElement.blur();
            }}
            className="active:bg-accent bg-accent/50 hover:bg-accent/70 ring-primary/30 hover:ring-primary/60 active:ring-primary/90 rounded-lg px-4 py-1 ring-1 duration-300 active:scale-95"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="group/button active:bg-primary rounded-lg bg-[#493E37] px-6 py-1.5 text-white duration-300 hover:bg-[#3d342f] hover:shadow-lg active:scale-95 active:shadow-sm"
          >
            <p className="duration-300 ease-out">Comment</p>
          </button>
        </div>
      </div>
    </div>
  );
}
