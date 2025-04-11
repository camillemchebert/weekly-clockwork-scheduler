
import { Trailer, TrailerStatus } from "@/types";
import { STATUS_COLORS, TRAILERS, updateTrailerStatus } from "@/utils/trailerUtils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface TrailerSelectorProps {
  selectedTrailer: Trailer;
  onTrailerChange: (trailer: Trailer) => void;
}

const TrailerSelector = ({ selectedTrailer, onTrailerChange }: TrailerSelectorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";
  
  const handleTrailerChange = (trailerId: string) => {
    const trailer = TRAILERS.find(t => t.id === trailerId) || TRAILERS[0];
    onTrailerChange(trailer);
  };

  const handleStatusChange = (status: string) => {
    // Update the trailer status
    const updatedTrailers = updateTrailerStatus(
      selectedTrailer.id, 
      status as TrailerStatus
    );
    
    // Find the updated trailer
    const updatedTrailer = updatedTrailers.find(t => t.id === selectedTrailer.id);
    
    if (updatedTrailer) {
      onTrailerChange(updatedTrailer);
    }
    
    // Show a toast notification
    toast({
      title: "Status updated",
      description: `${selectedTrailer.name} status changed to ${status}`
    });
  };

  // Get background color for the status badge
  const getStatusColor = (status: TrailerStatus) => {
    return STATUS_COLORS[status] || "#8E9196"; // Default to neutral gray
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
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
      
      {/* Status display for all users */}
      <div className="flex items-center space-x-2">
        <span className="font-medium text-sm">Status:</span>
        <Badge 
          style={{ 
            backgroundColor: getStatusColor(selectedTrailer.status),
            color: selectedTrailer.status === "predeployment" ? "#333" : "#fff" 
          }}
        >
          {selectedTrailer.status}
        </Badge>
      </div>
      
      {/* Status dropdown only for admin users */}
      {isAdmin && (
        <div className="flex items-center space-x-2">
          <label className="font-medium text-sm">Change Status:</label>
          <Select
            value={selectedTrailer.status}
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
      )}
    </div>
  );
};

export default TrailerSelector;
