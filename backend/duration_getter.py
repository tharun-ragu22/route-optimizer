from datetime import date
import requests
import os
import requests
from dotenv import load_dotenv
from datetime import date
from typing import Tuple
import time
from constants import RATE_LIMIT_ERROR, NO_ROUTE_FOUND_ERROR

load_dotenv()

TOMTOM_KEY = os.getenv("TOMTOM_API_KEY")
def get_duration_from_external_api(src: Tuple[float, float], dst: Tuple[float, float], depart_hr: int, depart_min: int) -> int:
    # get the lat, lng for both src and dst
    print("getting duration for", src, dst, depart_hr, depart_min)
    src_lat, src_lng = src
    dst_lat, dst_lng = dst
    print((src_lat, src_lng))

    format = lambda x : f"{'0' if x < 10 else ''}{x}"

    depart_time = f"{format(depart_hr)}:{format(depart_min)}:00"

    # use api to see get how long it takes
    TRAFFIC_URL = f"https://api.tomtom.com/routing/1/calculateRoute/{src_lat},{src_lng}:{dst_lat},{dst_lng}/json?key={TOMTOM_KEY}&departAt={date.today().isoformat()}T{depart_time}&traffic=true"
    traffic_response = requests.get(TRAFFIC_URL)

    traffic_data = traffic_response.json()
    if "detailedError" in traffic_data:
        print(src, dst, depart_hr, depart_min, ': Error in tomtom query / could not get route')
        print(traffic_data)
        if "NO_ROUTE_FOUND" in traffic_data['detailedError']['message']:
            return NO_ROUTE_FOUND_ERROR
        return RATE_LIMIT_ERROR
    time.sleep(0.1)

    res = traffic_data["routes"][0]["summary"]["travelTimeInSeconds"]//60
    print("final duration for", src, dst, depart_hr, depart_min, ":", res)
    return res

if __name__ == "__main__":
    src_coords, dst_coords = (43.809121399999995, -79.13123209999999), (43.8210944, -79.1137687)

    print(get_duration_from_external_api(src_coords, dst_coords, 17, 5))