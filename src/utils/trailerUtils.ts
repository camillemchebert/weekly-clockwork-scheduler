
import { Trailer } from "@/types";

// Generate an array of trailer IDs from AI2 to AI25
export const generateTrailers = (): Trailer[] => {
  const trailers: Trailer[] = [];
  
  for (let i = 2; i <= 25; i++) {
    const id = `AI${i}`;
    trailers.push({
      id,
      name: id
    });
  }
  
  return trailers;
};

export const TRAILERS = generateTrailers();
