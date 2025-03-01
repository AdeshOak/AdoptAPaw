import { useNavigate, useLocation } from "react-router-dom";
import { useFavorites } from "@/contexts/favorites-context";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWishlistPage = location.pathname === '/wishlist';
  const { favorites, toggleFavorite, resetFavorites } = useFavorites();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await api.logout();
      resetFavorites();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">AdoptAPaw</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => isWishlistPage ? navigate('/search') : navigate('/wishlist', { state: { favorites } })}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            disabled={!isWishlistPage && favorites.size === 0}
          >
            {isWishlistPage ? "Back to Search" : `Wishlist (${favorites.size})`}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};