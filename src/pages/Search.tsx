import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Dog } from "@/types";
import { api } from "@/lib/api";

//import required UI components
import { DogCard} from "@/components/DogCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Pagination } from "@/components/Pagination";
import { BreedModal } from "@/components/BreedModal";
import { DogDetailModal } from "@/components/DogDetailModal";
import { useToast } from "@/components/ui/use-toast";

//import required contexts 
import { useFavorites } from "@/contexts/favorites-context";
import { useSearchFilters } from "@/contexts/search-filters-context";



const Search = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBreedForModal, setSelectedBreedForModal] = useState<string | null>(null);
  const [isBreedModalOpen, setIsBreedModalOpen] = useState(false);
  const [breedSections, setBreedSections] = useState<Record<string, Dog[]>>({});
  const [selectedDogDetail, setSelectedDogDetail] = useState<Dog | null>(null);

  const pageSize = 20;


  const { 
    filters: { breeds: selectedBreeds, locations: selectedLocations, sortOrder }, 
    setFilters 
  } = useSearchFilters();

  // Update state setters to use context
  const setSelectedBreeds = (breeds: string[]) => 
    setFilters(prev => ({ ...prev, breeds }));
  
  const setSelectedLocations = (locations: string[]) => 
    setFilters(prev => ({ ...prev, locations }));
  
  const setSortOrder = (order: "asc" | "desc") => 
    setFilters(prev => ({ ...prev, sortOrder: order }));



  useEffect(() => {
    fetchDogs();
  }, [selectedBreeds, selectedLocations, sortOrder, currentPage]);



// Modified fetchDogs function for fetching according to breed filters selected and one singular dog array separately
const fetchDogs = async () => {
  try {
    setIsLoading(true);
    
    if (selectedBreeds.length > 0) {

      // Fetch dogs for each breed separately
      const breedPromises = selectedBreeds.map(async (breed) => {
        const response = await api.searchDogs({
          breeds: [breed],
          zipCodes: selectedLocations,
          sort: `breed:${sortOrder}`,
          size: 8, // Get exactly 8 per breed
          from: 0
        });
        const dogs = await api.getDogs(response.resultIds);
        return { breed, dogs };
      });

      const breedResults = await Promise.all(breedPromises);
      const sections = breedResults.reduce((acc, result) => {
        acc[result.breed] = result.dogs;
        return acc;
      }, {} as Record<string, Dog[]>);
      
      setBreedSections(sections);
      setDogs([]); // Clear main dogs array
    } else {
      // Original fetch for all dogs
      const response = await api.searchDogs({
        breeds: [],
        zipCodes: selectedLocations,
        sort: `breed:${sortOrder}`,
        size: pageSize,
        from: (currentPage - 1) * pageSize
      });
      const dogsData = await api.getDogs(response.resultIds);
      setDogs(dogsData);
      setTotalPages(Math.ceil(response.total / pageSize));
    }
  }  catch (error) {
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

  //console.log(sortOrder)

  

  const { favorites, toggleFavorite, resetFavorites } = useFavorites();

  return (
    
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">AdoptAPaw</h1>
          <div className="flex items-center gap-4">
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
          //Show top 8 dogs of each breed in selected sortorder(for breed name) with a separate view all button
          <div className="space-y-8">
            {selectedBreeds
            .slice()
            .sort((a, b) => 
              sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)
            )
            .map((breed) => {
              const breedDogs = breedSections[breed] || [];
              return (
                <div key={breed} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold capitalize">{breed}</h2>
                    {breedDogs.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedBreedForModal(breed);
                          setIsBreedModalOpen(true);
                        }}
                        className="text-primary hover:text-primary/80 font-medium underline"
                      >
                        View all {breed} dogs →
                      </button>
                    )}
                  </div>
        
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {breedDogs.map((dog) => (
                      <DogCard
                        key={dog.id}
                        dog={dog}
                        isFavorite={favorites.has(dog.id)}
                        onToggleFavorite={() => toggleFavorite(dog.id)}
                        onClick={() => setSelectedDogDetail(dog)}
                      />
                    ))}
                  </div>
                  <div className="border-t my-6" />
                </div>
              );
            })}
          </div>
        ) : (
          //Default Mapping of all dogs when no filter is selected
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.has(dog.id)}
                onToggleFavorite={() => toggleFavorite(dog.id)}
                onClick={() => setSelectedDogDetail(dog)}
              />
            ))}
          </div>
        )}

      {/* Pagination - only show this when no breeds selected */}
      {selectedBreeds.length === 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Breed Modal - popup to show all dogs of the dog breed for which we click View all  */}
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

      {/*Popup to show dog card in zoomed view on click*/}
      {selectedDogDetail && (
        <DogDetailModal
          dog={selectedDogDetail}
          isFavorite={favorites.has(selectedDogDetail.id)}
          onClose={() => setSelectedDogDetail(null)}
          onToggleFavorite={() => toggleFavorite(selectedDogDetail.id)}
        />
      )}
      </main>
    </div>
  );
};

export default Search;