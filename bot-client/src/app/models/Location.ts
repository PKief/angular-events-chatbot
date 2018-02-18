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
  address_components: any;
  adr_address: string;
  formatted_address: string;
  formatted_phone_number: string;
  opening_hours: {
    open_now: boolean;
    periods: any[],
    weekday_text: string[],
  };
  price_level: number;
  website: string;
  url: string;
}
