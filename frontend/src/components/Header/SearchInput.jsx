import { useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams("");
  const lastChange = useRef();
  const navigate = useNavigate();

  function modifySearchParams(searchTerm) {
    if (searchTerm) {
      navigate("/");
      setSearchParams({ q: searchTerm });
    } else {
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete("q");
      setSearchParams(updatedParams);
    }
  }

  function handleSearch(event) {
    if (lastChange.current) {
      clearTimeout(lastChange.current);
    }

    lastChange.current = setTimeout(() => {
      lastChange.current = null;
      modifySearchParams(event.target.value);
    }, 700);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const search = formData.get("search");

    modifySearchParams(search);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="ring-primary/30 hover:ring-secondary focus-within:ring-secondary mr-3 flex w-80 items-center gap-2 rounded-md bg-white py-2 pr-3 duration-300 ease-out focus-within:shadow-lg hover:shadow-lg"
    >
      <input
        type="text"
        name="search"
        onChange={handleSearch}
        placeholder="Search something"
        aria-label="Search something"
        className="h-full w-full bg-white pl-4 text-sm placeholder-gray-500 outline-none"
      />
      <button
        aria-label="Submit search"
        className="flex items-center justify-center text-lg duration-300 hover:scale-125"
      >
        <ion-icon name="search-outline"></ion-icon>
      </button>
    </form>
  );
}
