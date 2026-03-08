import { geocode } from '@tomtom-org/maps-sdk/services';
import { TomTomConfig } from '@tomtom-org/maps-sdk/core';

TomTomConfig.instance.put({ 
  apiKey: process.env.NEXT_PUBLIC_TOMTOM_API_KEY 
});

export const addressToCoordinates = async (address: string) : Promise<[number, number] | null> => {
  try {
    const response = await geocode({
      query: address,
      limit: 1
    });

    if (response.features && response.features.length > 0) {
      const [ lon, lat ] = response.features[0].geometry.coordinates;
      return [lon, lat]; // Returns [longitude, latitude] for the map
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
  }
  return null;
};