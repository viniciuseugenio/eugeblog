import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  type,
  name,
  setClientSide,
  id,
  label,
  className = "mb-6",
  error,
  isError,
  ...props
}) {
  const borderColor = isError || error ? "border-red-600" : "border-secondary";
  const textColor = isError || error ? "text-red-600" : "text-secondary";
  const input = useRef();
  const [EyeIcon, setEyeIcon] = useState(Eye);

  function handleShowPassword() {
    const nextType = input.current.type === "password" ? "text" : "password";
    input.current.type = nextType;

    if (nextType === "text") {
      setEyeIcon(EyeOff);
    } else if (nextType === "password") {
      setEyeIcon(Eye);
    }
  }

  function handleChange() {
    setClientSide((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[name];
      return { errors: newErrors };
    });
  }

  return (
    <div className={className || ""}>
      <div className="relative">
        <input
          ref={input}
          type={type}
          name={name}
          id={id}
          onChange={handleChange}
          placeholder=" "
          className={`${borderColor} focus:border-primary text-primary focus:text-primary peer box-border w-full rounded-sm border py-2 pl-4 text-base outline-none`}
          required
          {...props}
        />
        <label
          htmlFor={id}
          className={`${textColor} peer-focus:text-primary absolute left-2 z-50 translate-y-[-50%] bg-white px-2 text-base duration-300 peer-placeholder-shown:top-1/2 peer-focus:top-0`}
        >
          {label}
        </label>
        {type === "password" && (
          <button
            onClick={handleShowPassword}
            type="button"
            className="absolute right-2 top-2/4 translate-y-[-50%]"
          >
            <EyeIcon size={16} className="text-primary/70" />
          </button>
        )}
      </div>

      {error && (
        <ul className="flex flex-col gap-2">
          {error.map((err, index) => (
            <li className="text-red-600" key={index}>
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
