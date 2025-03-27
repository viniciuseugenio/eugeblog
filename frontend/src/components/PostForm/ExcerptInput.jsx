import { useState, useRef, useEffect } from "react";

export default function ExcerptInput({ value, className }) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
  }, [inputValue]);

  return (
    <textarea
      ref={inputRef}
      name="excerpt"
      id="excerpt"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className={`${className} max-h-24`}
      placeholder="Brief summary of your post"
      required={true}
    />
  );
}
