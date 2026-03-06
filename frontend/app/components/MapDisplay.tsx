"use client";

import { useEffect, useRef } from "react";
import { TomTomMap } from "@tomtom-org/maps-sdk/map";
import { TomTomConfig } from "@tomtom-org/maps-sdk/core";
import "maplibre-gl/dist/maplibre-gl.css";
import * as tt from "@tomtom-org/maps-sdk/map";
import { Marker } from "maplibre-gl";

interface MapDisplayProps {
  sourceLocation?: [number, number] | null;
}

export default function MapDisplay({ sourceLocation }: MapDisplayProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // 1. Set API Key
    console.log("Source location: ", sourceLocation);
    TomTomConfig.instance.put({
      apiKey: process.env.NEXT_PUBLIC_TOMTOM_API_KEY,
    });

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

    if (markerRef.current) {
      markerRef.current.remove();
    }

    if (sourceLocation) {
      markerRef.current = new Marker()
        .setLngLat(sourceLocation)
        .addTo(mapInstance.current.mapLibreMap);
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
  }, [sourceLocation]);

  return (
    <div
      ref={mapElement}
      data-testid="tomtom-map"
      style={{ width: "100%", height: "500px", borderRadius: "8px" }}
    />
  );
}