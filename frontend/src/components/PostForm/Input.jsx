import { useState } from "react";
import SelectCategory from "./SelectCategory.jsx";

export default function PostFormInput({
  label,
  required,
  name,
  id,
  type,
  errors,
  data,
}) {
  const [inputValue, setInputValue] = useState(data || "");

  let inputElement = (
    <input
      name={name}
      id={id}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="text-md ring-accent rounded-md p-2 outline-none ring-1 duration-300 focus:ring-2"
      type={type ? type : "text"}
      required={required}
    />
  );

  if (type === "select") {
    inputElement = (
      <SelectCategory
        key={inputValue?.id}
        value={inputValue?.id}
        name={name}
        id={id}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-primary text-xl" htmlFor={id}>
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      {inputElement}
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
