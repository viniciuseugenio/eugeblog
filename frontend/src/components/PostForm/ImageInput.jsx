import IconSpan from "../Header/IconSpan";
import { useState, useRef } from "react";
import { ImagePlus, Info, X } from "lucide-react";

export default function ImageInput({ data, errors }) {
  const [image, setImage] = useState(data);
  const inputRef = useRef();
  const borderColor = errors
    ? "border-red-400 hover:border-red-600"
    : "hover:border-secondary border-neutral-300";

  function getFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // Message to be less than 5MB
      return;
    }

    setImage(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImage(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label
          htmlFor="image"
          className={`${errors ? "text-red-600" : "text-primary"} text-sm font-medium`}
        >
          Featured Image
        </label>
        <div className="bg-light text-secondary ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs">
          <Info className="h-3 w-3" />
          Recommended size: 1366x720px
        </div>
      </div>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="file"
          onChange={getFile}
          name="image"
          className="hidden"
          accept="image/*"
          id="image"
        />

        {!image ? (
          <div
            onClick={() => inputRef.current?.click()}
            className={`${borderColor} flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed  duration-300`}
          >
            <ImagePlus className="mb-2 h-10 w-10 text-neutral-500" />
            <p className="text-sm text-neutral-500">Click to upload image</p>
            <p className="mt-1 text-xs text-neutral-400">PNG, JPG up to 5MB</p>
            <p className="text-secondary mt-2 text-xs font-medium">
              Recommended size: 1366x720px
            </p>
          </div>
        ) : (
          <div className="group relative h-40 w-full overflow-hidden rounded-md transition-all duration-300">
            <img
              className="h-full w-full rounded-md object-cover transition-all group-hover:brightness-90"
              src={image}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                Recommended size: 1366x720px
              </p>
            </div>
            <button
              type="button"
              className="absolute right-2 top-2 transform rounded-full bg-white p-1 shadow-md duration-200 hover:scale-105 hover:bg-neutral-200"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
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
