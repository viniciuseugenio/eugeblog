import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchCategories } from "../../utils/api";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SelectCategory({ value, name, id, errors }) {
  const { data, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const [selectedCategory, setSelectedCategory] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const buttonBorder = errors
    ? "border-red-500 ring-red-200 focus-within:border-red-600"
    : "border-accent/50 ring-accent/40 focus-within:border-primary/50";

  useEffect(() => {
    setSelectedCategory(value);
  }, [value]);

  return (
    <div className="relative space-y-2">
      {/* Hidden select for form submission */}
      <select
        value={selectedCategory?.id}
        name={name}
        id={id}
        className="hidden"
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select a category</option>

        {isPending && <option disabled>Loading...</option>}

        {data &&
          data.results.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
      </select>

      <label
        className={`${errors ? "text-red-600" : "text-primary"} text-sm font-medium`}
      >
        Category
      </label>

      <button
        type="button"
        className={`${buttonBorder} flex w-full items-center justify-between rounded-md border bg-inherit p-2 text-sm outline-none duration-300 focus:ring-2`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCategory ? selectedCategory.name : "Select a category"}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {errors && (
        <ul className="text-sm text-red-600">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={{ hidden: { y: -10, opacity: 0 } }}
            initial="hidden"
            animate={{ y: 0, opacity: 1 }}
            exit="hidden"
            className="absolute z-50 max-h-56 w-full space-y-1 overflow-scroll rounded-md border bg-white p-1 text-sm shadow-md"
            transition={{ bounce: 0, duration: 0.15 }}
          >
            {data?.results.map((category) => (
              <li
                key={category.id}
                className="hover:bg-light hover:text-primary grid grid-cols-[16px_1fr] items-center gap-x-2 rounded-md px-2 py-1.5 duration-300"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsOpen(false);
                }}
              >
                <span>
                  {selectedCategory?.id === category.id && (
                    <Check className="h-4 w-4" />
                  )}
                </span>
                {category.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
