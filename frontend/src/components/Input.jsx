import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  type,
  name,
  id,
  label,
  className,
  error,
  isError,
  fieldValidation,
  setClientSide,
  ...props
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const lastChange = useRef(null);
  const validationDelay = 1000;

  useEffect(() => {
    return () => {
      if (lastChange.current) {
        clearTimeout(lastChange.current);
      }
    };
  }, []);

  function handleShowPassword() {
    setIsPasswordVisible((prev) => !prev);
  }

  const borderColor =
    isError || error
      ? "border-red-600 ring-red-200"
      : "focus:border-secondary ring-light border-neutral-300";
  const textColor =
    isError || error ? "text-red-600" : "focus:text-secondary text-neutral-500";
  const labelTextColor =
    isError || error
      ? "text-red-600"
      : "peer-focus:text-secondary text-neutral-500";

  function handleChange(e) {
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }

    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      setClientSide((prev) => {
        const newErrors = { ...prev.errors };
        delete newErrors[name];
        return { errors: newErrors };
      });

      if (fieldValidation) {
        fieldValidation(e.target.value, setClientSide);
      }
    }, validationDelay);
  }

  return (
    <div className={className || ""}>
      <div className="relative">
        <input
          type={isPassword ? (isPasswordVisible ? "text" : "password") : type}
          name={name}
          id={id}
          placeholder=" "
          aria-invalid={isError || !!error}
          className={`${borderColor} ${textColor} peer box-border w-full rounded-md border py-2 pl-4 text-base outline-none duration-300 focus:ring-2`}
          required
          onChange={handleChange}
          {...props}
        />
        <label
          htmlFor={id}
          className={`${labelTextColor} absolute left-2 z-50 -translate-y-1/2 bg-white px-2 text-sm duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm`}
        >
          {label}
        </label>

        {isPassword && (
          <button
            onClick={handleShowPassword}
            type="button"
            className="absolute right-2 top-2/4 translate-y-[-50%]"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <EyeOff className="text-primary/70 h-4 w-4" />
            ) : (
              <Eye className="text-primary/70 h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {Array.isArray(error) && error.length > 0 && (
        <ul
          id={`${id}-error`}
          className="flex flex-col gap-2 text-sm text-red-600"
        >
          {error.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
