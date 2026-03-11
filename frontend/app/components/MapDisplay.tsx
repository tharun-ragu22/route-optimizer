"use client";

import { useEffect, useRef } from "react";
import { TomTomMap } from "@tomtom-org/maps-sdk/map";
import { TomTomConfig } from "@tomtom-org/maps-sdk/core";
import "maplibre-gl/dist/maplibre-gl.css";
import { Marker } from "maplibre-gl";
import getRoute from "./routefinder";

interface MapDisplayProps {
  sourceLocation?: [number, number] | null;
  destinationLocation?: [number, number] | null;
  submitCounter: number;
}

export default function MapDisplay({
  sourceLocation,
  destinationLocation,
  submitCounter,
}: MapDisplayProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const sourceMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);

  useEffect(() => {
    // 1. Set API Key
    TomTomConfig.instance.put({
      apiKey: process.env.NEXT_PUBLIC_TOMTOM_API_KEY,
    });
    const isTest = process.env.NEXT_PUBLIC_APP_ENV === "test";

    if (mapElement.current && !mapInstance.current) {
      // 2. Initialize the Map
      mapInstance.current = new TomTomMap({
        mapLibre: {
          container: mapElement.current,

          center: [0, 0], // Pickering, ON
          zoom: 1,
        },
      });
    }

    if (sourceMarkerRef.current) {
      sourceMarkerRef.current.remove();
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
    }

    if (sourceLocation && !destinationLocation) {
      console.log("only source location added", sourceLocation);
      sourceMarkerRef.current = new Marker()
        .setLngLat(sourceLocation)
        .addTo(mapInstance.current.mapLibreMap);
      if (!isTest) {
        mapInstance.current.mapLibreMap.flyTo({
          center: sourceLocation,
          zoom: 12,
          duration: 2000,
        });
      }
    } else if (sourceLocation && destinationLocation) {
      console.log(
        "source and dest added. source:",
        sourceLocation,
        "destination:",
        destinationLocation,
      );
      sourceMarkerRef.current = new Marker()
        .setLngLat(sourceLocation)
        .addTo(mapInstance.current.mapLibreMap);

      destinationMarkerRef.current = new Marker()
        .setLngLat(destinationLocation)
        .addTo(mapInstance.current.mapLibreMap);

      if (!isTest) {
        const bounds: [number, number][] = [
          [Math.min(sourceLocation[0], destinationLocation[0]), Math.min(sourceLocation[1], destinationLocation[1])],
          [Math.max(sourceLocation[0], destinationLocation[0]), Math.max(sourceLocation[1], destinationLocation[1])],
        ];
        // Apply to the internal map engine
        mapInstance.current.mapLibreMap.fitBounds(
          bounds,
          {
            padding: 50, // Pixels of "breathing room" around the markers
            duration: 2000, // Animation length in ms
            essential: true, // Animation runs even if user prefers reduced motion
            
          },
        );
      }

      
    }

    // 3. Cleanup on unmount
    return () => {
      if (
        mapInstance.current &&
        typeof mapInstance.current.remove === "function"
      ) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [sourceLocation, destinationLocation, submitCounter]);

  useEffect(() => {
    // Define the async logic inside the effect
    const fetchAndDrawRoute = async () => {
        if (submitCounter > 0 && sourceLocation && destinationLocation) {
        try {
            // 1. Resolve the promise here
            const routes = await getRoute(sourceLocation, destinationLocation);
            
            const map = mapInstance.current.mapLibreMap;

            // 2. Check if the source already exists to avoid "already in use" errors
            if (map.getSource('route-source')) {
            map.getSource('route-source').setData(routes);
            } else {
            map.addSource('route-source', {
                type: 'geojson',
                data: routes
            });

            map.addLayer({
                id: 'route-layer',
                type: 'line',
                source: 'route-source',
                paint: {
                'line-color': '#0070f3',
                'line-width': 5
                }
            });
            }
        } catch (error) {
            console.error("Failed to fetch route:", error);
        }
        }
    };

    // Execute the function immediately
    fetchAndDrawRoute();
    
    }, [submitCounter]
    );

  return (
    <div
      ref={mapElement}
      data-testid="tomtom-map"
      style={{ width: "100%", height: "500px", borderRadius: "8px" }}
    />
  );
}