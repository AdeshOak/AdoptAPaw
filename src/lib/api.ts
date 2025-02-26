import { Dog, LoginCredentials, SearchResponse, Location, LocationSearchParams, LocationSearchResponse } from "@/types";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

export const api = {
  login: async (credentials: LoginCredentials): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  searchDogs: async (
    params: {
      breeds?: string[];
      zipCodes?: string[];
      sort?: string;
      size?: number;
      from?: number;
    }
  ): Promise<SearchResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.breeds?.length) {
      params.breeds.forEach(breed => searchParams.append("breeds", breed));
    }
    if (params.zipCodes?.length) {
      params.zipCodes.forEach(zip => searchParams.append("zipCodes", zip));
    }
    if (params.sort) searchParams.append("sort", params.sort);
    if (params.size) searchParams.append("size", params.size.toString());
    if (params.from) searchParams.append("from", params.from.toString());

    const response = await fetch(
      `${API_BASE_URL}/dogs/search?${searchParams.toString()}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search dogs");
    }

    return response.json();
  },

  getLocations: async (zipCodes: string[]): Promise<Location[]> => {
    if (zipCodes.length > 100) {
      throw new Error("Maximum of 100 ZIP codes allowed");
    }

    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zipCodes),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    return response.json();
  },

  searchLocations: async (params: LocationSearchParams): Promise<LocationSearchResponse> => {
    const response = await fetch(`${API_BASE_URL}/locations/search`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to search locations");
    }

    return response.json();
  },

  searchLocationsByCity: async (city: string): Promise<Location[]> => {
    const response = await fetch(`${API_BASE_URL}/locations/search`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city }),
    });

    if (!response.ok) {
      throw new Error("Failed to search locations");
    }

    const data: LocationSearchResponse = await response.json();
    return data.results;
  },

  getBreeds: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch breeds");
    }

    return response.json();
  },

  getDogs: async (ids: string[]): Promise<Dog[]> => {
    const response = await fetch(`${API_BASE_URL}/dogs`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dogs");
    }

    return response.json();
  },

  generateMatch: async (favoriteIds: string[]): Promise<{ match: string }> => {
    const response = await fetch(`${API_BASE_URL}/dogs/match`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favoriteIds),
    });

    if (!response.ok) {
      throw new Error("Failed to generate match");
    }

    return response.json();
  },
};
