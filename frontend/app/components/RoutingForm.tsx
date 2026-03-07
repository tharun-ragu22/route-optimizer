'use client'
import { useState } from "react";
import MapSearch from "./MapSearch";
import MapDisplay from "./MapDisplay";

export const sample = () => {console.log('submitted form')};

interface RoutingFormProps {
  /** Callback function triggered when the form is submitted */
  onSubmit: (
    src: string, 
    dst: string, 
    time_leave_min: string, 
    time_leave_max: string
  ) => void;
  
  /** Boolean state to indicate if a routing request is currently in progress */
  isLoading: boolean;
}

export default function RoutingForm({ onSubmit = sample, isLoading}: RoutingFormProps) {
    const [sourceAddress, setSourceAddress] = useState<string | null>(null);
    const [destinationAddress, setDestinationAddress] = useState<string | null>(null);

    const [sourceCoordinates, setSourceCoordinates] = useState<[number, number] | null>(null);
    const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | null>(null);
    
    const [minTime, setMinTime] = useState<string>("12:00");
    const [maxTime, setMaxTime] = useState<string>("12:00");

    const time1LessThanTime2 = (time1: string, time2: string) => {
      const [h1, m1] = time1.split(":").map((x) => parseInt(x));
      const [h2, m2] = time2.split(":").map((x) => parseInt(x));

      if (h1 < h2) return true;
      if (h1 == h2 && m1 < m2) return true;
      return false;
    };
    const validateInput = () => {
      return sourceAddress != null && destinationAddress != null && time1LessThanTime2(minTime, maxTime);
    };

    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (validateInput()) {
            await onSubmit(sourceAddress!, destinationAddress!, minTime, maxTime);
          }
        }}

        className="space-y-3"
        
      >
        <div data-testid="source-wrapper" >
          <MapSearch
            placeholderText="Source Address"
            setAddress={setSourceAddress}
            setCoordinates={setSourceCoordinates}
            
          />
        </div>

        <div data-testid="destination-wrapper">
          <MapSearch
            placeholderText="Destination Address"
            setAddress={setDestinationAddress}
            setCoordinates={setDestinationCoordinates}
          />
        </div>

        <div data-testid="leave-time-min-wrapper">
          <p>Leave Time Min</p>
          <input
            data-testid="leave-time-min"
            type="time"
            className="p-2 border rounded text-black"
            defaultValue="12:00"
            onChange={(e) => setMinTime(e.target.value)}
          />
        </div>

        <div data-testid="leave-time-max-wrapper">
          <p>Leave Time Max</p>
          <input
            data-testid="leave-time-max"
            type="time"
            className="p-2 border rounded text-black"
            defaultValue="12:00"
            onChange={(e) => setMaxTime(e.target.value)}
          />
        </div>
        {!isLoading && <input type="submit" value="Submit" className="snazzy-submit"/>}
        {isLoading && <p>Loading result...</p>}
        <MapDisplay sourceLocation={sourceCoordinates} destinationLocation={destinationCoordinates}/>
      </form>
    );
    
}