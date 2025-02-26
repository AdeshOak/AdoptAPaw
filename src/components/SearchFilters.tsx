
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Location } from "@/types";
//import { Search } from "lucide-react";
import { Filter, X, Search } from "lucide-react";
import './searchfilter.css'

interface SearchFiltersProps {
  selectedBreeds: string[];
  setSelectedBreeds: (breeds: string[]) => void;
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;

  onClearFilters: () => void; 
}

export const SearchFilters = ({
  selectedBreeds,
  setSelectedBreeds,
  selectedLocations,
  setSelectedLocations,
  sortOrder,
  setSortOrder,
  onClearFilters,

}: SearchFiltersProps) => {
  const { toast } = useToast();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [breedSearchTerm, setBreedSearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const clearFilters = () => {
    setSelectedBreeds([]);
    setSelectedLocations([]);
    setBreedSearchTerm('');
    setLocationSearchTerm('');
    setSortOrder('asc');
    onClearFilters(); // Tell parent to refresh data
  };

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedsData = await api.getBreeds();
        setBreeds(breedsData);
      } catch (error) {
        console.error("Failed to fetch breeds:", error);
        toast({
          title: "Error",
          description: "Failed to fetch breeds. Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (locationSearchTerm.length < 2) {
        setLocations([]);
        return;
      }

      setIsSearchingLocation(true);
      try {
        // Search by city first
        const response = await api.searchLocations({
          city: locationSearchTerm,
          size: 25
        });
        
        // If no results found by city, try searching with state
        let results = response.results;
        if (results.length === 0 && locationSearchTerm.length === 2) {
          const stateResponse = await api.searchLocations({
            states: [locationSearchTerm.toUpperCase()],
            size: 25
          });
          results = stateResponse.results;
        }

        // Add direct ZIP code match if the search term looks like a ZIP code
        if (/^\d{5}$/.test(locationSearchTerm)) {
          const zipResponse = await api.getLocations([locationSearchTerm]);
          if (zipResponse.length > 0) {
            results = [...results, ...zipResponse];
          }
        }

        // Remove duplicates based on zip_code
        const uniqueResults = Array.from(
          new Map(results.map(location => [location.zip_code, location])).values()
        );

        setLocations(uniqueResults);
      } catch (error) {
        console.error("Failed to search locations:", error);
        toast({
          title: "Error",
          description: "Failed to search locations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearchingLocation(false);
      }
    };

    const debounce = setTimeout(searchLocations, 500);
    return () => clearTimeout(debounce);
  }, [locationSearchTerm]);

  const filteredBreeds = breeds.filter((breed) =>
    breed.toLowerCase().includes(breedSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(selectedBreeds.length + selectedLocations.length) > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-1 text-xs text-white">
                {selectedBreeds.length + selectedLocations.length}
              </span>
            )}
          </button>
  
          {(selectedBreeds.length > 0 || selectedLocations.length > 0) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1"
            >
              Clear All
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
  
        <select
          className="px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>
  
      {/* Filters Panel */}
      {isFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 sm:bg-transparent sm:static">
          <div className="absolute right-0 top-0 h-full w-full bg-white p-6 shadow-lg sm:relative sm:rounded-lg sm:p-4 sm:shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <div className="flex gap-2">


              <button
                onClick={() => {
                  setSelectedBreeds([]);
                  setBreedSearchTerm('');
                }}
                className="text-sm text-destructive hover:text-destructive/80"
                disabled={selectedBreeds.length === 0}
              >
                Clear Breeds
              </button>
              <button
                onClick={() => {
                  setSelectedLocations([]);
                  setLocationSearchTerm('');
                }}
                className="text-sm text-destructive hover:text-destructive/80"
                disabled={selectedLocations.length === 0}
              >
                Clear Locations
              </button>




                <button
                  onClick={clearFilters}
                  className="text-destructive hover:text-destructive/80 px-3 py-1 rounded-lg"
                  disabled={selectedBreeds.length === 0 && selectedLocations.length === 0}
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
  
            


            {/* Breed Search with Autocomplete */}
          <div className="space-y-4 mb-6 relative">
            <label className="block text-sm font-medium text-gray-700">
              Search Breeds
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search breeds..."
                className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                value={breedSearchTerm}
                onChange={(e) => setBreedSearchTerm(e.target.value)}
                onFocus={() => setShowBreedDropdown(true)}
                onBlur={() => setTimeout(() => setShowBreedDropdown(false), 200)}
              />
              {showBreedDropdown && (
                <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg border bg-white shadow-lg">
                  {filteredBreeds.map((breed) => (
                    <div
                      key={breed}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        if (!selectedBreeds.includes(breed)) {
                          setSelectedBreeds([...selectedBreeds, breed]);
                        }
                        setBreedSearchTerm('');
                      }}
                    >
                      {breed}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Selected Breeds */}
            <div className="flex flex-wrap gap-2">
              {selectedBreeds.map((breed) => (
                <span
                  key={breed}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                >
                  {breed}
                  <X
                    className="h-4 w-4 cursor-pointer hover:text-primary/70"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSelectedBreeds(selectedBreeds.filter(b => b !== breed));
                    }}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Location Search with Autocomplete */}
          <div className="space-y-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Search Locations
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="City, State, or ZIP..."
                className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                value={locationSearchTerm}
                onChange={(e) => setLocationSearchTerm(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
              />
              {isSearchingLocation && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="animate-spin h-4 w-4 text-gray-400" />
                </div>
              )}
              
              {showLocationDropdown && locations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg border bg-white shadow-lg">
                  {locations.map((location) => (
                    <div
                      key={location.zip_code}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        if (!selectedLocations.includes(location.zip_code)) {
                          setSelectedLocations([...selectedLocations, location.zip_code]);
                        }
                        setLocationSearchTerm('');
                      }}
                    >
                      {location.city}, {location.state} ({location.zip_code})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Locations */}
            <div className="flex flex-wrap gap-2">
              {selectedLocations.map((zip) => {
                const location = locations.find(l => l.zip_code === zip);
                return (
                  <span
                    key={zip}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                  >
                    {location ? `${location.city}, ${location.state}` : zip}
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-primary/70"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedLocations(selectedLocations.filter(z => z !== zip));
                      }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )}


  
      {/* Active Filters Preview */}
      {!isFiltersOpen && (selectedBreeds.length > 0 || selectedLocations.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedBreeds.map((breed) => (
            <span
              key={breed}
              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-1"
            >
              {breed}
              <X
                className="h-4 w-4 cursor-pointer hover:text-primary/70"
                onClick={() => setSelectedBreeds(selectedBreeds.filter(b => b !== breed))}
              />
            </span>
          ))}
          {selectedLocations.map((zip) => {
            const location = locations.find(l => l.zip_code === zip);
            return (
              <span
                key={zip}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-1"
              >
                {location ? `${location.city}, ${location.state}` : zip}
                <X
                  className="h-4 w-4 cursor-pointer hover:text-primary/70"
                  onClick={() => setSelectedLocations(selectedLocations.filter(z => z !== zip))}
                />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
