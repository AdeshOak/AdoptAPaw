import { createContext, useContext, useState, ReactNode } from "react";

type FavoritesContextType = {
  favorites: Set<string>;
  toggleFavorite: (dogId: string) => void;
  resetFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("favorites");
      return new Set(saved ? JSON.parse(saved) : []);
    }
    return new Set();
  });

  const resetFavorites = () => {
    sessionStorage.removeItem("favorites");
    setFavorites(new Set());
  };

  const toggleFavorite = (dogId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
      } else {
        newFavorites.add(dogId);
      }
      sessionStorage.setItem("favorites", JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider 
      value={{ favorites, toggleFavorite, resetFavorites }} // Add reset
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};