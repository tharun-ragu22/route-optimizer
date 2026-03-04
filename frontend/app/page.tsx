'use client'
import { LoadScript } from "@react-google-maps/api";
import RoutingForm from "./components/RoutingForm";
import { useState } from "react";

export default function Home() {
  const libraries: ("places")[] = ["places"];
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false)
  const handleSubmit = () => {
    console.log('form submitted');
    setIsLoading(true)
    setIsLoading(false)
    setHasSubmittedOnce(true)

  }
  // console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        
        <div className="p-10">
          <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ""}
          libraries={libraries}
          >
            <RoutingForm onSubmit={handleSubmit}/>
          </LoadScript>
          {hasSubmittedOnce && !isLoading && <p>Time to leave:</p>}
          {hasSubmittedOnce && !isLoading && <p>Expected duration: </p>}
        </div>
      </main>
    </div>
  );
}
