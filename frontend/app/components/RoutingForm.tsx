'use client'
import { useState } from "react";
import MapSearch from "./MapSearch";
import MapDisplay from "./MapDisplay";

export const sample = () => {console.log('submitted form')};
export const TimeErrorMessage = "Make sure the earliest departure is before the latest departure!";
export const SourceAddressNullErrorMessage = "Enter a source address!";
export const DestinationAddressNullErrorMessage = "Enter a destination address!";

interface RoutingFormProps {
  /** Callback function triggered when the form is submitted */
  onSubmit?: (
    src: [number, number], 
    dst: [number, number], 
    time_leave_min: string, 
    time_leave_max: string
  ) => Promise<void> | null;
  
  /** Boolean state to indicate if a routing request is currently in progress */
  isLoading: boolean;
  setIsLoading: (load_val: boolean) => void;
}

export default function RoutingForm({ onSubmit, isLoading, setIsLoading }: RoutingFormProps) {
    const [sourceAddress, setSourceAddress] = useState<string | null>(null);
    const [destinationAddress, setDestinationAddress] = useState<string | null>(null);

    const [sourceCoordinates, setSourceCoordinates] = useState<[number, number] | null>(null);
    const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | null>(null);

    const [submitCounter, setSubmitCounter] = useState(0);
    const [bestTime, setBestTime] = useState("");
    const [expectedDuration, setExpectedDuration] = useState("");

    const [minTime, setMinTime] = useState<string>("07:00");
    const [maxTime, setMaxTime] = useState<string>("09:00");

    const handleSubmit = async (
      src: [number, number],
      dst: [number, number],
      time_leave_min: string,
      time_leave_max: string,
    ) => {
      console.log("form submitted");
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        const response = await fetch(
          `${baseUrl}/get_best_time?src_lat=${src[1]}&src_lng=${src[0]}&dst_lat=${dst[1]}&dst_lng=${dst[0]}&time_leave_min=${encodeURIComponent(time_leave_min)}&time_leave_max=${encodeURIComponent(time_leave_max)}`,
          {
            method: "GET",
          },
        );
        const data = await response.json();
        console.log(data);

        setBestTime(data.best_time);
        setExpectedDuration(data.expected_duration);
      } finally {
        setSubmitCounter(submitCounter + 1);
        setIsLoading(false);
      }
    };

    onSubmit = onSubmit ?? handleSubmit;

    const time1LessThanTime2 = (time1: string, time2: string) => {
      const [h1, m1] = time1.split(":").map((x) => parseInt(x));
      const [h2, m2] = time2.split(":").map((x) => parseInt(x));

      if (h1 < h2) return true;
      if (h1 == h2 && m1 < m2) return true;
      return false;
    };
  
    const validateInput = () => {
      if (sourceAddress === null){
        return SourceAddressNullErrorMessage
      }
      else if (destinationAddress === null){
        return DestinationAddressNullErrorMessage
      }
      else if (!time1LessThanTime2(minTime, maxTime)){
        return TimeErrorMessage
      }
      return "";
    };

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-15">
        <div className="p-6 dark:bg-zinc-800">
          <form
          onSubmit={async (e) => {
            e.preventDefault();
            const validateResult = validateInput();
            if (validateResult != ""){
              alert(validateResult)
            }
            else {
              await onSubmit(
                sourceCoordinates!,
                destinationCoordinates!,
                minTime,
                maxTime,
              );
            }
          }}
          className="space-y-3"
        >
          <div data-testid="source-wrapper">
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

          <p>Time Range</p>
          <div className="grid grid-cols-2">
            <div data-testid="leave-time-min-wrapper" className="mr-6">
              <p>Earliest Departure</p>
              <input
                data-testid="leave-time-min"
                type="time"
                className="p-2 border rounded text-black"
                defaultValue="07:00"
                onChange={(e) => setMinTime(e.target.value)}
              />
            </div>
            <div data-testid="leave-time-max-wrapper" className="ml-6">
              <p>Latest Departure</p>
              <input
                data-testid="leave-time-max"
                type="time"
                className="p-2 border rounded text-black"
                defaultValue="09:00"
                onChange={(e) => setMaxTime(e.target.value)}
              />
            </div>
          </div>
          {!isLoading && (
            <input type="submit" value="Submit" className="snazzy-submit" />
          )}
          {isLoading && <p>Loading result...</p>}

          {submitCounter > 0 && !isLoading && <p>Time to leave: {bestTime}</p>}
          {submitCounter > 0 && !isLoading && (
            <p>Expected duration: {expectedDuration} minutes</p>
          )}
          
        </form>
        </div>
        <div className="md:col-span-2 dark:bg-zinc-800">
          <MapDisplay
            sourceLocation={sourceCoordinates}
            destinationLocation={destinationCoordinates}
            submitCounter={submitCounter}
          />
          <p>Enter addresses in the form to see them on the map</p>
        </div>
      </div>
        
        
      </div>
    );
    
}