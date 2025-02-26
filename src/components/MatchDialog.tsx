
import { Dog } from "@/types";
import { Dialog } from "@/components/ui/dialog";

interface MatchDialogProps {
  dog: Dog;
  isOpen: boolean;
  onClose: () => void;
}

export const MatchDialog = ({ dog, isOpen, onClose }: MatchDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={dog.img}
              alt={dog.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-bold text-center">
              Meet your perfect match!
            </h3>
            <div className="space-y-2">
              <p className="text-lg font-semibold">{dog.name}</p>
              <p className="text-muted-foreground">{dog.breed}</p>
              <p className="text-muted-foreground">{dog.age} years old</p>
              <p className="text-muted-foreground">ZIP: {dog.zip_code}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
