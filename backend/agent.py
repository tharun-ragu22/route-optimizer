from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent

import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from duration_getter import get_duration_from_api

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
def get_duration(src: str, dst: str, depart_hr: int, depart_min: int) -> int:
    """
    Get how long it takes to travel from the source address to the destination address, if the trip starts at depart_hr:depart_min:depart_sec

    depart_hr represents the hour in a 24 hour time system (e.g. 17 instead of 5pm)

    """
    return get_duration_from_api(src, dst, depart_hr, depart_min)

tools = [get_duration]
agent = create_agent(llm, tools, response_format=AgentResponse)  

def get_best_time(src: str, dst: str, time_leave_min: str, time_leave_max: str) -> int:
    
    result = agent.invoke({
        "messages": [
            {
                "role":"system",
                "content":
                """
                You are a traffic commute agent who understands traffic trends in different cities in Canada and the United States.

                The user will provide you a source address, a destination address, and a time range in which they can start their journey.

                Return the minimum travel time needed to go from the source address to the destination, and the time in the provided range
                to leave, in order to achieve this minimum travel time.
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
