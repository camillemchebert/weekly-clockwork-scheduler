
import { Trailer, TrailerStatus } from "@/types";

// Generate an array of trailer IDs from AI2 to AI25
export const generateTrailers = (): Trailer[] => {
  const trailers: Trailer[] = [];
  
  for (let i = 2; i <= 25; i++) {
    const id = `AI${i}`;
    // Default status is "open"
    trailers.push({
      id,
      name: id,
      status: "open"
    });
  }
  
  return trailers;
};

// Define status colors for styling
export const STATUS_COLORS = {
  open: "#33C3F0", // Sky Blue
  predeployment: "#F2FCE2", // Soft Green
  deployed: "#F97316" // Bright Orange
};

export const TRAILERS = generateTrailers();

// Get all trailers or update a trailer's status
export const updateTrailerStatus = (
  trailerId: string, 
  status: TrailerStatus
): Trailer[] => {
  // Create a copy of the trailers array
  const updatedTrailers = TRAILERS.map(trailer => {
    if (trailer.id === trailerId) {
      return { ...trailer, status };
    }
    return trailer;
  });
  
  // Update the TRAILERS constant
  // Note: In a real app, this would be handled by a state management system
  // This is a simplified approach for this demo
  TRAILERS.splice(0, TRAILERS.length, ...updatedTrailers);
  
  return updatedTrailers;
};
