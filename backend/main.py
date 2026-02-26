from fastapi import FastAPI, HTTPException
import uvicorn
from agent import get_best_time
from constants import NO_ROUTE_FOUND_ERROR

app = FastAPI()

@app.get("/get_best_time")
def get_best_time_endpoint(
    src: str,
    dst: str,
    time_leave_min: str,
    time_leave_max: str
):
    res = get_best_time(src, dst, time_leave_min, time_leave_max)
    if res == NO_ROUTE_FOUND_ERROR:
        raise HTTPException(status_code=400, detail=f"No route found between {src} and {dst}")
    return {'best_time': res}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)