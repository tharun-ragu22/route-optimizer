from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
import time

import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from duration_getter import get_duration_from_external_api
from geocoder import geocode
import time
from typing import Tuple
from constants import RATE_LIMIT_ERROR, NO_ROUTE_FOUND_ERROR

load_dotenv(override=False)

class AgentResponse(BaseModel):
    """Best time to leave, and how long the trip will take"""
    best_time: str = Field("best time to leave")
    duration: int = Field("how long the trip will take, in minutes")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0
)
TOMTOM_KEY = os.getenv("TOMTOM_API_KEY")
@tool
def get_duration(src_lat: float, src_lng: float, dst_lat: float, dst_lng: float, depart_hr: int, depart_min: int) -> AgentResponse:
    """
    Get how long it takes to travel from the source address to the destination address, if the trip starts at depart_hr:depart_min:depart_sec

    depart_hr represents the hour in a 24 hour time system (e.g. 17 instead of 5pm)

    """
    src = (src_lat, src_lng)
    dst = (dst_lat, dst_lng)
    res =  get_duration_from_external_api(src, dst, depart_hr, depart_min)
    for i in range(3):
        if res == RATE_LIMIT_ERROR:
            time.sleep(0.5 * 2 ** i)
            res =  get_duration_from_external_api(src, dst, depart_hr, depart_min)
        else:
            break
    return res


def is_driveable(src: Tuple[float, float], dst: Tuple[float, float]) -> bool:
    """Determines if it possible to drive from the source address to the destination address, by car"""
    res = get_duration_from_external_api(src, dst, 0, 0)
    for i in range(3):
        if res == NO_ROUTE_FOUND_ERROR:
            return False
        if res != RATE_LIMIT_ERROR:
            return True
        time.sleep(0.5 * 2 ** i)
        res = get_duration_from_external_api(src, dst, 0, 0)

    return False
        

tools = [get_duration]
agent = create_agent(llm, tools, response_format=AgentResponse)  

def get_best_time(src_lat: float, src_lng: float, dst_lat: float, dst_lng: float, time_leave_min: str, time_leave_max: str) -> int:
    if not is_driveable((src_lat, src_lng), (dst_lat, dst_lng)):
        return NO_ROUTE_FOUND_ERROR
    start = time.time()
    result = agent.invoke({
        "messages": [
            {
                "role":"system",
                "content":
                f"""
                You are a traffic commute agent who understands traffic trends in different cities around the world.
                You are also conscious of resource usage, and will never use resources like tool calls more than necessary.

                The user will provide you a source location as a latitude, longitude tuple, a destination location as a latitude, longitude tuple, and a time range in which they can start their journey.

                You know that traffic conditions will not change every minute, so you will not exhaust every possible hour-minute combination in the range.
                You will only ever make duration calls, that is, calls to the get_duration tool for leaving times 15 minutes apart from each other.

                You will adaptively skip and try a different time range (i.e. at least 30 minutes away) if you notice that the results of the last few duration calls you make are within about 10 minutes of each other.
                You will never retry a duration call with the exact same parameters, as the result will always be the same. Retrying a duration call would be wasting resources.

                You should make exactly 15 duration calls. If you make any more or less, the universe will explode. Be thoughtful when making duration calls, and learn from previous results.
                You can at most simulataneously run 3 duration calls. From the results from these calls, you must learn and make your future calls based on what you learned.
                Furthermore, you should be make duration calls spread across the time range, not concentrated between a small subrange of the input.

                Return the minimum travel time needed to go from the source address to the destination, and the time in the provided range
                to leave, in order to achieve this minimum travel time. If multiple leaving times have the same minimum travel time, you will choose the latest leaving time.
                """
            },
            {
                "role":"user",
                "content": f"My source location is ({src_lat}, {src_lng}) and my destination location is ({dst_lat}, {dst_lng}). I can start my journey between {time_leave_min} and {time_leave_max}"
            }
        ]
    })
    end = time.time()
    print("FINAL ANSWER:")
    print(f'took {end-start} seconds to finish')
    
    result : AgentResponse = result["structured_response"]
    print(result)
    return result
