import { useState } from "react";
import ExcerptInput from "./ExcerptInput";

export default function PostFormInput({
  label,
  required,
  name,
  id,
  type = "text",
  errors,
  data,
  placeholder,
  helpText,
}) {
  const [inputValue, setInputValue] = useState(data || "");
  let inputElement;
  const inputBorders = errors
    ? "border-red-500 ring-red-200 focus-within:border-red-600"
    : "border-accent/50 ring-accent/40 focus-within:border-primary/50";
  const inputStyle =
    "rounded-md border p-2 text-sm outline-none duration-300 focus:ring-2 " +
    inputBorders;

  if (type === "text") {
    inputElement = (
      <input
        name={name}
        id={id}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={inputStyle}
        type={type ? type : "text"}
        placeholder={placeholder}
        required={required}
      />
    );
  }

  if (type === "textarea") {
    inputElement = <ExcerptInput value={inputValue} className={inputStyle} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`${errors ? "text-red-600" : "text-primary"} text-sm font-medium`}
        htmlFor={id}
      >
        {label}
      </label>
      {inputElement}
      {errors && (
        <ul className="text-sm text-red-600">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <span className="text-xs text-neutral-500">{helpText}</span>
    </div>
  );
}
