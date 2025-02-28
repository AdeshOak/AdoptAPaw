import { Dog } from "@/types";
import { X, Heart } from "lucide-react";

interface DogDetailModalProps {
  dog: Dog | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}

export const DogDetailModal = ({ 
  dog, 
  isFavorite,
  onClose,
  onToggleFavorite 
}: DogDetailModalProps) => {
  if (!dog) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-xl max-w-2xl w-full flex overflow-hidden animate-in fade-in-zoom">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        <div className="w-[40%] relative">
          <img
            src={dog.img}
            alt={dog.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="w-[60%] p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{dog.name}</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Breed:</span>
                <span className="text-muted-foreground">{dog.breed}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Age:</span>
                <span className="text-muted-foreground">{dog.age} years</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Location:</span>
                <span className="text-muted-foreground">ZIP {dog.zip_code}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onToggleFavorite}
            className="mt-6 w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};