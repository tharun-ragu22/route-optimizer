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

load_dotenv()

TOMTOM_KEY = os.getenv("TOMTOM_API_KEY")
def get_duration_from_api(src: str, dst: str, depart_hr: int, depart_min: int, depart_sec: int) -> int:
    # get the lat, lng for both src and dst
    src_lat, src_lng = geocode(src)
    dst_lat, dst_lng = geocode(dst)

    format = lambda x : f"{'0' if x < 10 else ''}{x}"

    depart_time = f"{format(depart_hr)}:{format(depart_min)}:{format(depart_sec)}"

    # use api to see get how long it takes
    TRAFFIC_URL = f"https://api.tomtom.com/routing/1/calculateRoute/{src_lat},{src_lng}:{dst_lat},{dst_lng}/json?key={TOMTOM_KEY}&departAt={date.today().isoformat()}T{depart_time}&traffic=true"
    traffic_response = requests.get(TRAFFIC_URL)

    traffic_data = traffic_response.json()

    return traffic_data["routes"][0]["summary"]["travelTimeInSeconds"]//60

if __name__ == "__main__":
    src = "300 Kingston Rd, Pickering, ON L1V 1A2"
    dst = "742 Kingston Rd, Pickering, ON L1V 1G4"

    print(get_duration_from_api(src, dst, 17, 5, 1))