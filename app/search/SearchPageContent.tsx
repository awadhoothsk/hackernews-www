// app/search/SearchPageContent.tsx
"use client";

import { useSearchParams } from "next/navigation";

const SearchPageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return <div>Search query: {query}</div>;
};

export default SearchPageContent;
