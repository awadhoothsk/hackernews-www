// app/search/page.tsx
import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";


const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
