import { useEffect, useState, useRef } from "react";
import { useActionData, useNavigation } from "react-router-dom";

export default function TextArea() {
  const textArea = useRef();
  const [value, setValue] = useState("");
  const actionData = useActionData();
  const navigation = useNavigation();

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
        id="content"
        value={value}
        placeholder="Add a comment..."
        onChange={handleChange}
        className="peer mb-2 w-full border-b border-[#AB886D] outline-none duration-300 focus:border-[#493628]"
      />

      <div className="invisible mb-0 flex justify-end gap-3 opacity-0 duration-300 peer-focus:visible peer-focus:mb-6 peer-focus:opacity-100">
        <button
          type="reset"
          onClick={() => (textArea.current.value = "")}
          className="rounded-lg bg-[#E4E0E1] px-3 py-1 duration-300 hover:bg-[#cdcacb]"
          disabled={navigation.state === "submitting"}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={navigation.state === "submitting"}
          className="rounded-lg bg-[#493628] px-3 py-1 text-[#E4E0E1] duration-300 hover:bg-[#33261c]"
        >
          Comment
        </button>
      </div>
    </>
  );
}
