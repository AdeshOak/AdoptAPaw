import { useEffect, useState } from "react";
import { Dog } from "@/types";
import { api } from "@/lib/api";
import { DogCard } from "@/components/DogCard";
import { Pagination } from "@/components/Pagination";
import { X } from "lucide-react";
import { useFavorites } from "@/contexts/favorites-context";

interface BreedModalProps {
  breed: string;
  locations: string[];
  isOpen: boolean;
  onClose: () => void;
}

  export const BreedModal = ({ breed, locations, isOpen, onClose }: BreedModalProps) => {
    const [modalDogs, setModalDogs] = useState<Dog[]>([]);
    const [modalCurrentPage, setModalCurrentPage] = useState(1);
    const [modalTotalPages, setModalTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 20;

    const { favorites, toggleFavorite, resetFavorites } = useFavorites();
  
    useEffect(() => {
      const fetchModalDogs = async () => {
        try {
          setIsLoading(true);
          const response = await api.searchDogs({
            breeds: [breed],
            zipCodes: locations,
            size: pageSize,
            from: (modalCurrentPage - 1) * pageSize
          });
          const dogs = await api.getDogs(response.resultIds);
          setModalDogs(dogs);
          setModalTotalPages(Math.ceil(response.total / pageSize));
        } catch (error) {
          console.error("Failed to fetch modal dogs:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      if (isOpen) fetchModalDogs();
    }, [breed, locations, modalCurrentPage, isOpen]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <button
      onClick={onClose}
      className="fixed top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors z-50"
    >
      <X className="h-6 w-6 text-gray-700" />
    </button>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All {breed} Dogs</h2>

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
                {modalDogs.map((dog) => (
                  <DogCard
                    key={dog.id}
                    dog={dog}
                    isFavorite={favorites.has(dog.id)}
                    onToggleFavorite={() => toggleFavorite(dog.id)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={modalCurrentPage}
                totalPages={modalTotalPages}
                onPageChange={setModalCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};