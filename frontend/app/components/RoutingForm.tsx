'use client'
import { useState } from "react";
import MapSearch from "./MapSearch";

export const sample = () => {console.log('submitted form')};

export default function RoutingForm({ onSubmit = sample}: { onSubmit: () => void }) {
    const [source, setSource] = useState<string | null>(null);
    const [destination, setDestination] = useState<string | null>(null);

    const [minTime, setMinTime] = useState<string>("12:00");
    const [maxTime, setMaxTime] = useState<string>("12:00");

    const validateInput = () => {
        console.log(source, destination, minTime, maxTime);
    }
    
    return (
        
            <form onSubmit={(e) => {
                e.preventDefault();
                validateInput();
                onSubmit();
            }}>
                <div data-testid="source-wrapper">
                    <MapSearch placeholderText="Source Address" onSelectLocation={setSource}/>
                </div>
                
                <div data-testid="destination-wrapper">
                    <MapSearch placeholderText="Destination Address" onSelectLocation={setDestination}/>
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
                <input type="submit" value="Submit" />

            </form>
    )
    
}