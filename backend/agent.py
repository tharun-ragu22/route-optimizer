from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent

import os
import requests
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from datetime import date
from typing import List
from geocoder import geocode
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
def get_duration(src: str, dst: str, depart_hr: int, depart_min: int, depart_sec: int) -> int:
    return get_duration_from_api(src, dst, depart_hr, depart_min, depart_sec)
    

def get_best_time(src: str, dst: str, time_leave_min: str, time_leave_max: str) -> int:
    """Get """
    pass
