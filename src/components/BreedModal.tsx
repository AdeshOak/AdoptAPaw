import { useEffect, useState } from "react";
import { Dog } from "@/types";
import { api } from "@/lib/api";
import { DogCard } from "@/components/DogCard";
import { Pagination } from "@/components/Pagination";
import { X } from "lucide-react";

interface BreedModalProps {
  breed: string;
  locations: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const BreedModal = ({ breed, locations, isOpen, onClose }: BreedModalProps) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 20;

  useEffect(() => {
    const fetchBreedDogs = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const response = await api.searchDogs({
          breeds: [breed],
          zipCodes: locations,
          size: pageSize,
          from: (currentPage - 1) * pageSize,
        });
        
        const dogsData = await api.getDogs(response.resultIds);
        setDogs(dogsData);
        setTotalPages(Math.ceil(response.total / pageSize));
      } catch (error) {
        console.error("Failed to fetch breed dogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreedDogs();
  }, [breed, locations, currentPage, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All {breed} Dogs</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[300px] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dogs.map((dog) => (
                  <DogCard
                    key={dog.id}
                    dog={dog}
                    isFavorite={false}
                    onToggleFavorite={() => {}}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};