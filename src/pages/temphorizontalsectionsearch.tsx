import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DogCard} from "@/components/DogCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Pagination } from "@/components/Pagination";
import { MatchDialog } from "@/components/MatchDialog";
import { Dog } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

import { useFavorites } from "@/contexts/favorites-context";
import { BreedModal } from "@/components/BreedModal";



const Search = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);

  const [selectedBreedForModal, setSelectedBreedForModal] = useState<string | null>(null);
  const [isBreedModalOpen, setIsBreedModalOpen] = useState(false);

  const pageSize = 20;


  

  useEffect(() => {
    fetchDogs();
  }, [selectedBreeds, selectedLocations, sortOrder, currentPage]);

  const fetchDogs = async () => {
    try {
      setIsLoading(true);
      const searchParams = {
        breeds: selectedBreeds,
        zipCodes: selectedLocations,
        sort: `breed:${sortOrder}`,
        size: pageSize,
        from: (currentPage - 1) * pageSize,
      };
  
      // If showing breed sections, get more results
      if (selectedBreeds.length > 0) {
        searchParams.size = 100; // Get more dogs to fill multiple breed sections
      }



      /*const searchResponse = await api.searchDogs({
        breeds: selectedBreeds,
        zipCodes: selectedLocations,
        sort: `breed:${sortOrder}`,
        size: pageSize,
        from: (currentPage - 1) * pageSize,
      });*/

      const searchResponse = await api.searchDogs(searchParams);

      const dogsData = await api.getDogs(searchResponse.resultIds);
      setDogs(dogsData);
      setTotalPages(Math.ceil(searchResponse.total / pageSize));
    } catch (error) {
      console.error("Failed to fetch dogs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dogs. Please try again.",
        variant: "destructive",
      });
      if (error instanceof Error && error.message.includes("Login failed")) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dogs when filters or page changes
  useEffect(() => {
    fetchDogs();
  }, [selectedBreeds, selectedLocations, sortOrder, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBreeds, selectedLocations, sortOrder]);

  const handleClearFilters = () => {
    setSelectedBreeds([]);
    setSelectedLocations([]);
    setSortOrder("asc");
    setCurrentPage(1);
  };
  
  const handleGenerateMatch = async () => {
    try {
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
      setMatchedDog(matchedDogData);
      setIsMatchDialogOpen(true);
    } catch (error) {
      console.error("Failed to generate match:", error);
      toast({
        title: "Error",
        description: "Failed to generate match. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const { favorites, toggleFavorite, resetFavorites } = useFavorites();

  return (
    
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">AdoptAPaw</h1>
          <div className="flex items

-center gap-4">
            <button
              onClick={() => navigate('/wishlist', { state: { favorites } })}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              disabled={favorites.size === 0}
            >
              Wishlist ({favorites.size})
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

      <main className="container mx-auto px-4 py-8">
        <SearchFilters
          selectedBreeds={selectedBreeds}
          setSelectedBreeds={setSelectedBreeds}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : selectedBreeds.length > 0 ? (
          <div className="space-y-8">
            {selectedBreeds.map((breed) => {
              const breedDogs = dogs.filter(dog => dog.breed === breed);
              return (
                <div key={breed} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold capitalize">{breed}</h2>
                    <button
                      onClick={() => {
                        setSelectedBreedForModal(breed);
                        setIsBreedModalOpen(true);
                      }}
                      className="text-primary hover:text-primary/80 font-medium underline"
                    >
                      View all {breed} dogs →
                    </button>
                  </div>
      
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {breedDogs.slice(0, 8).map((dog) => (
                      <DogCard
                        key={dog.id}
                        dog={dog}
                        isFavorite={favorites.has(dog.id)}
                        onToggleFavorite={() => toggleFavorite(dog.id)}
                      />
                    ))}
                  </div>
                  <div className="border-t my-6" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.has(dog.id)}
                onToggleFavorite={() => toggleFavorite(dog.id)}
              />
            ))}
          </div>
        )}

        {/* Updated Pagination - only show when no breeds selected */}
  {selectedBreeds.length === 0 && totalPages > 1 && (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  )}

  {/* Breed Modal */}
  {selectedBreedForModal && (
    <BreedModal
      breed={selectedBreedForModal}
      locations={selectedLocations}
      isOpen={isBreedModalOpen}
      onClose={() => {
        setIsBreedModalOpen(false);
        setSelectedBreedForModal(null);
      }}
    />
  )}
      </main>

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
  );
};

export default Search;
