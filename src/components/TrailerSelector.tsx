
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
import StatusSelector from "./StatusSelector";

interface TrailerSelectorProps {
  selectedTrailer: Trailer;
  onTrailerChange: (trailer: Trailer) => void;
}

const TrailerSelector = ({ selectedTrailer, onTrailerChange }: TrailerSelectorProps) => {
  const handleTrailerChange = (trailerId: string) => {
    const trailer = TRAILERS.find(t => t.id === trailerId) || TRAILERS[0];
    onTrailerChange(trailer);
  };

  const handleStatusChange = (updatedTrailer: Trailer) => {
    onTrailerChange(updatedTrailer);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
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
      
      <StatusSelector 
        trailer={selectedTrailer} 
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default TrailerSelector;
