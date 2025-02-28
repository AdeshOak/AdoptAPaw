
import { Dog } from "@/types";
import { Heart } from "lucide-react";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const DogCard = ({ dog, isFavorite, onToggleFavorite, onClick }: DogCardProps & { onClick?: () => void }) => {
  return (
    <div 
      className="border rounded-lg p-4 relative hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
    <div className="glass-card rounded-lg overflow-hidden transition-transform hover:scale-[1.02] fade-in">
      <div className="relative aspect-square">
        <img
          src={dog.img}
          alt={dog.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent onClick from firing
            onToggleFavorite();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? "fill-primary stroke-primary" : "stroke-gray-500"
            }`}
          />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{dog.name}</h3>
          <span className="text-sm text-muted-foreground">{dog.age} years</span>
        </div>
        <p className="text-sm text-muted-foreground">{dog.breed}</p>
        <p className="text-sm text-muted-foreground">ZIP: {dog.zip_code}</p>
      </div>
    </div>
    </div>
  );
};
