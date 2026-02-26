from geocoder import geocode
from datetime import date
import requests

import os
import requests
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from datetime import date
from typing import List
from geocoder import geocode
import time
from constants import ERR_CODE

load_dotenv()

TOMTOM_KEY = os.getenv("TOMTOM_API_KEY")
def get_duration_from_external_api(src: str, dst: str, depart_hr: int, depart_min: int) -> int:
    # get the lat, lng for both src and dst
    print("getting duration for", src, dst, depart_hr, depart_min)
    src_lat, src_lng = geocode(src)
    dst_lat, dst_lng = geocode(dst)

    format = lambda x : f"{'0' if x < 10 else ''}{x}"

    depart_time = f"{format(depart_hr)}:{format(depart_min)}:00"

    # use api to see get how long it takes
    TRAFFIC_URL = f"https://api.tomtom.com/routing/1/calculateRoute/{src_lat},{src_lng}:{dst_lat},{dst_lng}/json?key={TOMTOM_KEY}&departAt={date.today().isoformat()}T{depart_time}&traffic=true"
    traffic_response = requests.get(TRAFFIC_URL)

    traffic_data = traffic_response.json()
    if "routes" not in traffic_data:
        print(src, dst, depart_hr, depart_min, ': Error in tomtom query / could not get route')
        print(traffic_data)
        return ERR_CODE
    time.sleep(0.5)

    res = traffic_data["routes"][0]["summary"]["travelTimeInSeconds"]//60
    print("final duration for", src, dst, depart_hr, depart_min, ":", res)
    return res

if __name__ == "__main__":
    src = "300 Kingston Rd, Pickering, ON L1V 1A2"
    dst = "742 Kingston Rd, Pickering, ON L1V 1G4"

    print(get_duration_from_external_api(src, dst, 17, 5, 1))