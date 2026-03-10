'use client'
import { LoadScript } from "@react-google-maps/api";
import RoutingForm from "./components/RoutingForm";
import { useState } from "react";

export default function Home() {
  const libraries: ("places")[] = ["places"];
  const [isLoading, setIsLoading] = useState(false)
  
  
  
  // console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>Route Optimizer</h1>

        <h3>Find the best time to leave to avoid traffic.</h3>
        
        <div className="p-10">
          <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ""}
          libraries={libraries}
          >
            <RoutingForm isLoading={isLoading} setIsLoading={setIsLoading}/>
          </LoadScript>
        </div>
      </main>
    </div>
  );
}
