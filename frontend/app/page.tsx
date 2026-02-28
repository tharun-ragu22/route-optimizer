'use client'

import Image from "next/image";
import { LoadScript } from "@react-google-maps/api";
import MapSearch from "./components/MapSearch";
import RoutingForm from "./components/RoutingForm";

export default function Home() {
  const libraries: ("places")[] = ["places"];
  // console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        
        <div className="p-10">
          <RoutingForm />
        </div>
        


        
      </main>
    </div>
  );
}
