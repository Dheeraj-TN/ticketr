// "use client";

import { Search } from "lucide-react";
import Form from "next/form";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

function SearchBar() {
  //   const router = useRouter();
  //   const [query, setQuery] = useState("");
  //   const handleSearch = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (query.trim()) {
  //       router.push(`/search?q=${encodeURIComponent(query)}`);
  //     }
  //   };
  return (
    <div>
      <Form action="/search" className="relative">
        <input
          type="text"
          name="q" //query
          //   value={query}
          //   onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for events..."
          className="w-full py-3 px-4 pl-12 bg-white rounded-xl border border-gray-200 shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          type="submit"
        >
          Search
        </button>
      </Form>
    </div>
  );
}

export default SearchBar;
