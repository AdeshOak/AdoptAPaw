import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Dog } from "@/types";

// Import components
import { useToast } from "@/components/ui/use-toast";
import { DogCard } from "@/components/DogCard";
import { MatchDialog } from "@/components/MatchDialog";
import { Header } from "@/components/Header";

// Import Context files
import { useFavorites } from "@/contexts/favorites-context";

const WishlistPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [wishlistDogs, setWishlistDogs] = useState<Dog[]>([]);
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (favorites.size === 0) return;
      
      try {
        setIsLoading(true);
        const dogs = await api.getDogs(Array.from(favorites));
        setWishlistDogs(dogs);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load wishlist",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [favorites]);

  const handleGenerateMatch = async () => {
    try {
      setIsGeneratingMatch(true);
      const favoriteIds = Array.from(favorites);
      
      if (favoriteIds.length === 0) {
        toast({
          title: "No favorites selected",
          description: "Please select at least one dog to generate a match.",
          variant: "destructive",
        });
        return;
      }

      const { match } = await api.generateMatch(favoriteIds);
      const [matchedDogData] = await api.getDogs([match]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMatchedDog(matchedDogData);
      setIsMatchDialogOpen(true);
    } catch (error) {
      console.error("Failed to generate match:", error);
      toast({
        title: "Error",
        description: "Failed to generate match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Loading overlay */}
      {isGeneratingMatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
        <img 
          src="/dogmatch-animation.png" 
          alt="Loading animation"
          className="w-20 h-20 transform transition-all duration-500 ease-in-out hover:scale-110"
        />
        <p className="text-white text-xl mt-4 font-semibold tracking-wide">
          Finding your pawbuddy!
        </p>
      </div>
      )}

      <Header />
      
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Wishlist</h1>
        </div>

        {/* Content rendering */}
        {isLoading ? (
          <div className="text-center py-8">Loading your wishlist...</div>
        ) : favorites.size === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Your wishlist is empty</p>
            <button
              onClick={() => navigate('/search')}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Browse Dogs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistDogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(dog.id)}
                showRemove={true}
              />
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGenerateMatch}
            className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            disabled={favorites.size === 0 || isGeneratingMatch}
          >
            Generate Match
          </button>
          <button
            onClick={() => navigate('/search')}
            className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            ← Back to Search
          </button>
        </div>

        {/* Match dialog */}
        {matchedDog && (
          <MatchDialog
            dog={matchedDog}
            isOpen={isMatchDialogOpen}
            onClose={() => {
              setIsMatchDialogOpen(false);
              setMatchedDog(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WishlistPage;