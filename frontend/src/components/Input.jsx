import { useRef, useState } from "react";

export default function Input({ type, name, id, label, className, error }) {
  const border = error ? "border-red-600" : "border-secondary";
  const text = error ? "text-red-600" : "text-secondary";
  const input = useRef();
  const [icon, setIcon] = useState("eye-outline");

  function handleShowPassword() {
    const nextType = input.current.type === "password" ? "text" : "password";
    input.current.type = nextType;

    if (nextType === "text") {
      setIcon("eye-off-outline");
      console.log(icon);
    } else if (nextType === "password") {
      setIcon("eye-outline");
    }
  }

  return (
    <div className={`relative mb-6 ${className ? className : ""}`}>
      <input
        ref={input}
        type={type}
        name={name}
        id={id}
        placeholder=" "
        className={`${border} focus:border-primary text-primary focus:text-primary peer box-border w-full rounded-sm border py-2 pl-4 text-base outline-none`}
        required
      />
      <label
        htmlFor={id}
        className={`${text} peer-focus:text-primary absolute left-2 z-50 translate-y-[-50%] bg-white px-2 text-base duration-300 peer-placeholder-shown:top-1/2 peer-focus:top-0`}
      >
        {label}
      </label>
      {type === "password" && (
        <button
          onClick={handleShowPassword}
          type="button"
          className="absolute right-2 top-2/4 translate-y-[-50%]"
        >
          <ion-icon name={icon}></ion-icon>
        </button>
      )}
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}
