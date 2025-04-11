
import { useState } from "react";
import { Trailer, TrailerStatus } from "@/types";
import { STATUS_COLORS, updateTrailerStatus } from "@/utils/trailerUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface StatusSelectorProps {
  trailer: Trailer;
  onStatusChange?: (trailer: Trailer) => void;
}

const StatusSelector = ({ trailer, onStatusChange }: StatusSelectorProps) => {
  const { toast } = useToast();
  
  const handleStatusChange = (status: string) => {
    // Update the trailer status
    const updatedTrailers = updateTrailerStatus(
      trailer.id, 
      status as TrailerStatus
    );
    
    // Find the updated trailer
    const updatedTrailer = updatedTrailers.find(t => t.id === trailer.id);
    
    if (updatedTrailer && onStatusChange) {
      onStatusChange(updatedTrailer);
    }
    
    // Show a toast notification
    toast({
      title: "Status updated",
      description: `${trailer.name} status changed to ${status}`
    });
  };

  // Get background color for the status badge
  const getStatusColor = (status: TrailerStatus) => {
    return STATUS_COLORS[status] || "#8E9196"; // Default to neutral gray
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <label className="font-medium text-sm">Status:</label>
        <Badge 
          style={{ 
            backgroundColor: getStatusColor(trailer.status),
            color: trailer.status === "predeployment" ? "#333" : "#fff" 
          }}
        >
          {trailer.status}
        </Badge>
      </div>
      
      <Select
        value={trailer.status}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Change status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="predeployment">Predeployment</SelectItem>
          <SelectItem value="deployed">Deployed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
