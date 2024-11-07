export default function Input({ type, name, id, label }) {
  return (
    <div className="relative mb-6">
      <input
        type={type}
        name={name}
        id={id}
        placeholder=" "
        className="border-secondary focus:border-primary peer box-border w-full rounded-sm border py-2 pl-4 text-base outline-none"
      />
      <label
        htmlFor={id}
        className="text-secondary peer-focus:text-primary absolute left-2 z-50 translate-y-[-50%] bg-white px-2 text-base duration-300 peer-placeholder-shown:top-1/2 peer-focus:top-0"
      >
        {label}
      </label>
    </div>
  );
}
