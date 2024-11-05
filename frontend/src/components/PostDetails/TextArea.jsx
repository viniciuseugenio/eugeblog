import { useEffect, useState, useRef } from "react";
import { useActionData } from "react-router-dom";

export default function TextArea() {
  const textArea = useRef();
  const [value, setValue] = useState("");
  const actionData = useActionData();

  useEffect(() => {
    if (actionData && actionData?.status === 201) {
      setValue("");
    }
  }, [actionData]);

  function handleChange(event) {
    setValue(event.target.value);
  }

  useEffect(() => {
    textArea.current.style.height = "auto";
    textArea.current.style.height = textArea.current.scrollHeight + "px";
  }, [value]);

  return (
    <>
      <textarea
        ref={textArea}
        name="content"
        value={value}
        placeholder="Add a comment..."
        onChange={handleChange}
        className="mb-2 w-full border-b border-[#AB886D] outline-none duration-300 focus:border-[#493628]"
      ></textarea>
    </>
  );
}
