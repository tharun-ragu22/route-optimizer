from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent

import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from duration_getter import get_duration_from_external_api
import time
from constants import RATE_LIMIT_ERROR, NO_ROUTE_FOUND_ERROR

load_dotenv()

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
def get_duration(src: str, dst: str, depart_hr: int, depart_min: int) -> AgentResponse:
    """
    Get how long it takes to travel from the source address to the destination address, if the trip starts at depart_hr:depart_min:depart_sec

    depart_hr represents the hour in a 24 hour time system (e.g. 17 instead of 5pm)

    """
    
    res =  get_duration_from_external_api(src, dst, depart_hr, depart_min)
    for i in range(3):
        if res == RATE_LIMIT_ERROR:
            time.sleep(0.5 * 2 ** i)
            res =  get_duration_from_external_api(src, dst, depart_hr, depart_min)
        else:
            break
    return res


def is_driveable(src:str, dst: str) -> bool:
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

def get_best_time(src: str, dst: str, time_leave_min: str, time_leave_max: str) -> int:
    
    if not is_driveable(src, dst):
        return NO_ROUTE_FOUND_ERROR
    result = agent.invoke({
        "messages": [
            {
                "role":"system",
                "content":
                """
                You are a traffic commute agent who understands traffic trends in different cities around the world.
                You are also conscious of resource usage, and will never use resources like tool calls more than necessary.

                The user will provide you a source address, a destination address, and a time range in which they can start their journey.

                You know that traffic conditions will not change every minute, so you will not exhaust every possible hour-minute combination in the range.
                You will only ever make duration calls for leaving times 15 minutes apart from each other.

                You will adaptively skip and try a different time range (i.e. at least 30 minutes away) if you notice that the results of the last few duration calls you make are within about 10 minutes of each other.
                You will never retry a duration call with the exact same parameters, as the result will always be the same. Retrying a duration call would be wasting resources.

                Return the minimum travel time needed to go from the source address to the destination, and the time in the provided range
                to leave, in order to achieve this minimum travel time. If multiple leaving times have the same minimum travel time, you will choose the latest leaving time.
                """
            },
            {
                "role":"user",
                "content": f"I am currently at {src}, and my destination is {dst}. I can start my journey between {time_leave_min} and {time_leave_max}"
            }
        ]
    })

    print("FINAL ANSWER:")
    result : AgentResponse = result["structured_response"]
    print(result)
    return result
