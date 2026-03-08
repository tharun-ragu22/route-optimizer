import { calculateRoute } from '@tomtom-org/maps-sdk/services';
import { Routes, TomTomConfig } from '@tomtom-org/maps-sdk/core';
TomTomConfig.instance.put({ 
  apiKey: process.env.NEXT_PUBLIC_TOMTOM_API_KEY 
});

export default async function getRoute(source: [number, number], destination: [number, number]): Promise<Routes> {
  
  const routes = await calculateRoute(
    {
      locations: [
      source, destination
    ],
    travelMode: 'car'
    },
    {
      
    }
  )

  return routes;
}

