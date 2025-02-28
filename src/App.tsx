
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import WishlistPage from "./pages/WishlistPage";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { SearchFiltersProvider } from "./contexts/search-filters-context";

const queryClient = new QueryClient();

const App = () => (
  <SearchFiltersProvider>
  <FavoritesProvider>
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<WishlistPage/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
  </FavoritesProvider>
  </SearchFiltersProvider>
);

export default App;
