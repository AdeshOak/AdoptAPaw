
export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeoBoundingBox {
  top?: Coordinates;
  left?: Coordinates;
  bottom?: Coordinates;
  right?: Coordinates;
  bottom_left?: Coordinates;
  top_right?: Coordinates;
  bottom_right?: Coordinates;
  top_left?: Coordinates;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: GeoBoundingBox;
  size?: number;
  from?: number;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

export interface LoginCredentials {
  name: string;
  email: string;
}

export interface SearchFilters {
  breeds?: string[];
  zipCodes?: string[];
  sort?: string;
  size?: number;
  from?: number;
}
