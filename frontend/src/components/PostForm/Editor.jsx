import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor({ data, errors }) {
  const [content, setContent] = useState(data);

  return (
    <div className="col-span-2 flex flex-col gap-2">
      <label className="text-primary text-xl" htmlFor="id_content">
        Content
        <span className="text-red-600">*</span>
      </label>
      <div>
        <ReactQuill theme="snow" value={content} onChange={setContent} />
        <input type="hidden" id="id_content" name="content" value={content} />
      </div>
      {errors && (
        <ul className="text-red-600">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
