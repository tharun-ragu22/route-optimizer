import { LoadScript } from "@react-google-maps/api";
import MapSearch from "./MapSearch";

export default function RoutingForm() {
    const libraries: ("places")[] = ["places"];
    
    return (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ""}
          libraries={libraries}
        >
            <form>
                <MapSearch/>
                <MapSearch/>

            </form>
        </LoadScript>
    )
    
}