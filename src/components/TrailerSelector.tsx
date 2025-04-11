
import { useState } from "react";
import { Trailer } from "@/types";
import { TRAILERS } from "@/utils/trailerUtils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrailerSelectorProps {
  selectedTrailer: Trailer;
  onTrailerChange: (trailer: Trailer) => void;
}

const TrailerSelector = ({ selectedTrailer, onTrailerChange }: TrailerSelectorProps) => {
  const handleTrailerChange = (trailerId: string) => {
    const trailer = TRAILERS.find(t => t.id === trailerId) || TRAILERS[0];
    onTrailerChange(trailer);
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="font-medium text-sm">Trailer:</label>
      <Select 
        value={selectedTrailer.id} 
        onValueChange={handleTrailerChange}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Select Trailer" />
        </SelectTrigger>
        <SelectContent>
          {TRAILERS.map((trailer) => (
            <SelectItem key={trailer.id} value={trailer.id}>
              {trailer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TrailerSelector;
