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

      <div className="font-base invisible mb-6 flex origin-right scale-0 transform justify-end gap-3 opacity-0 duration-300 ease-in-out group-focus-within/div:visible group-focus-within/div:scale-100 group-focus-within/div:opacity-100">
        <button
          type="reset"
          onClick={() => setValue("")}
          className="active:bg-light rounded-lg px-3 py-1.5"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="group/button rounded-lg bg-[#493628] px-6 py-1.5 text-white duration-300 hover:bg-[#33261c]"
        >
          <p className="duration-300 ease-out group-hover/button:scale-110">
            Comment
          </p>
        </button>
      </div>
    </div>
  );
}
