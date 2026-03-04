from fastapi import FastAPI, HTTPException
import uvicorn
from agent import get_best_time
from constants import NO_ROUTE_FOUND_ERROR
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000"
]

print(origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # List of allowed origins
    allow_credentials=True,        # Allow cookies and authorization headers
    allow_methods=["*"],           # Allow all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],           # Allow all headers
)

@app.get("/get_best_time")
def get_best_time_endpoint(
    src: str,
    dst: str,
    time_leave_min: str,
    time_leave_max: str
):
    
    print('received request: ', src, dst, time_leave_min, time_leave_max)
    res = get_best_time(src, dst, time_leave_min, time_leave_max)
    if res == NO_ROUTE_FOUND_ERROR:
        raise HTTPException(status_code=400, detail=f"No route found between {src} and {dst}")
    return {'best_time': res.best_time, 'expected_duration': res.duration}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)