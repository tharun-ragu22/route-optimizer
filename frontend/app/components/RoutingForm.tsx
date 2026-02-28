'use client'
import { LoadScript } from "@react-google-maps/api";
import MapSearch from "./MapSearch";
import React from "react";

export default function RoutingForm({ onSubmit }: { onSubmit: () => void }) {
    
    
    return (
        
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}>
                <div data-testid="source-wrapper">
                    <MapSearch placeholderText="Source Address"/>
                </div>
                
                <div data-testid="destination-wrapper">
                    <MapSearch placeholderText="Destination Address"/>
                </div>
                <input type="submit" value="Submit" />

            </form>
    )
    
}