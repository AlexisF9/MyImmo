import { createContext, useContext, useState } from "react";

// Create context / state
const SearchContext = createContext({
  search: undefined,
  setSearch: undefined,
});

// States par default
function useProvideSearch() {
  const [search, setSearch] = useState({
    city: "",
    type: "",
    categories: "",
    pieces: "",
    surface: "",
  });
  return { search, setSearch };
}

// Balise context avec la valeur par default du state
export function ProvideSearch({ children }) {
  const provideSearch = useProvideSearch();
  return (
    <SearchContext.Provider value={provideSearch}>
      {children}
    </SearchContext.Provider>
  );
}

// Export du context
export const useSearch = () => {
  return useContext(SearchContext);
};

///////////////////////////////////////////
// AUTRE MANIERE : UTILISER LE LOCALSTORAGE
