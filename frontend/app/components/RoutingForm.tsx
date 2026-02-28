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
                <MapSearch placeholderText="Source Address"/>
                <MapSearch placeholderText="Destination Address"/>
                <input type="submit" value="Submit" />

            </form>
    )
    
}