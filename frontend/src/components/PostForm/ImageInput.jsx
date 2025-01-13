import IconSpan from "../Header/IconSpan";
import { useState } from "react";

export default function ImageInput({ data, errors }) {
  const [image, setImage] = useState(data);

  function getFile(event) {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
  }

  return (
    <div className="mt-9">
      <label
        htmlFor="image"
        className="text-primary ring-accent active:ring-secondary mb-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 ring-1 duration-300 hover:ring-2"
      >
        {image ? (
          <img src={image} className="h-6 rounded-md" alt="" />
        ) : (
          <IconSpan>
            <ion-icon name="images-outline"></ion-icon>
          </IconSpan>
        )}
        <span>{image ? "Change " : "Upload "} your image</span>
      </label>
      <input
        type="file"
        onChange={getFile}
        name="image"
        className="hidden"
        accept="image/*"
        id="image"
      />
      <span className="text-sm text-black text-opacity-50">
        Recommended size: 1366x720
      </span>
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
