import { useEffect, useRef } from "react";

export default function CommentInput({ value, setValue }) {
  const textArea = useRef();

  function handleChange(event) {
    setValue(event.target.value);
  }

  useEffect(() => {
    textArea.current.style.height = "auto";
    textArea.current.style.height = textArea.current.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={textArea}
      name="content"
      id="comment-content"
      rows={1}
      value={value}
      placeholder="Share your thoughts..."
      onChange={handleChange}
      className="border-accent focus:border-primary mb-2 w-full border-b pb-1 outline-none duration-300"
    />
  );
}
