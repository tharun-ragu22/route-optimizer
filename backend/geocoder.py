import requests
from dotenv import load_dotenv
import urllib.parse
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def geocode(address: str):
    response = requests.get(f"https://geocode.googleapis.com/v4beta/geocode/address/{urllib.parse.quote(address)}?key={GOOGLE_API_KEY}")

    data = response.json()
    return (data["results"][0]["location"]["latitude"], data["results"][0]["location"]["longitude"])

if __name__ == "__main__":
    print(geocode("300 Kingston Rd, Pickering, ON L1V 1A2"))