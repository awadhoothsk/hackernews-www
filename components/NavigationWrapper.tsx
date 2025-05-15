"use client";

import NavigationBar from "@/components/NavigationBar";

const NavigationWrapper = () => {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // You can use router.push(`/search?q=${query}`); here if needed
  };

  return <NavigationBar onSearch={handleSearch} />;
};

export default NavigationWrapper;
