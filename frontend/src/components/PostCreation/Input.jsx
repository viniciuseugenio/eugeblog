import SelectCategory from "./SelectCategory.jsx";

export default function PostCreationInput({
  label,
  required,
  name,
  id,
  type,
  errors,
}) {
  let inputElement = (
    <input
      name={name}
      id={id}
      className="text-md ring-accent rounded-md p-2 outline-none ring-1 duration-300 focus:ring-2"
      type={type ? type : "text"}
      required={required}
    />
  );

  if (type === "select") {
    inputElement = <SelectCategory name={name} id={id} />;
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
