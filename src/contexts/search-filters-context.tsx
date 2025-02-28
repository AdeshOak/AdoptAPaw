// contexts/search-filters-context.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SearchFilters = {
    breeds: string[];
    locations: string[];
    sortOrder: "asc" | "desc";
  };
  
  type SearchFiltersContextType = {
    filters: SearchFilters;
    setFilters: (update: SearchFilters | ((prev: SearchFilters) => SearchFilters)) => void;
  };

const SearchFiltersContext = createContext<{
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}>({
  filters: { breeds: [], locations: [], sortOrder: "asc" },
  setFilters: () => {},
});

export const SearchFiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>(() => {
    if (typeof window === "undefined") return { breeds: [], locations: [], sortOrder: "asc" };
    
    const saved = sessionStorage.getItem("searchFilters");
    return saved ? JSON.parse(saved) : { breeds: [], locations: [], sortOrder: "asc" };
  });

  useEffect(() => {
    sessionStorage.setItem("searchFilters", JSON.stringify(filters));
  }, [filters]);

  return (
    <SearchFiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </SearchFiltersContext.Provider>
  );
};

export const useSearchFilters = () => useContext(SearchFiltersContext);