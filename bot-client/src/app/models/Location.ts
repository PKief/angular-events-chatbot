export interface Location {
  geometry: {
    location: {
      lat: number,
      lng: number,
    },
    viewport: {
      northeast: { lat: number, lng: number }
      southwest: { lat: number, lng: number }
    }
  };
  icon: string;
  id: string;
  name: string;
  photos: any[];
  place_id: string;
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  vicinity: string;
}
