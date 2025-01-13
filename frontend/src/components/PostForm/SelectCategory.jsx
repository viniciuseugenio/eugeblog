import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchCategories } from "../../utils/http";

export default function SelectCategory({ value, name, id }) {
  const { data, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const [category, setCategory] = useState(value);

  return (
    <select
      value={category}
      name={name}
      id={id}
      onChange={(e) => setCategory(e.target.value)}
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
