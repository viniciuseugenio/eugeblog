import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../utils/http";

export default function SelectCategory({ name, id }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <select
      name={name}
      id={id}
      className="text-md ring-accent rounded-md bg-inherit p-2 outline-none ring-1 duration-300 focus:ring-2"
    >
      <option value="">Select a category</option>

      {isPending && <option disabled>Loading...</option>}

      {data &&
        data.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
    </select>
  );
}
