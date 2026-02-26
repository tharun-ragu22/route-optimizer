from fastapi import FastAPI
import uvicorn
from agent import get_best_time

app = FastAPI()

@app.get("/get_best_time")
def get_best_time_endpoint(
    src: str,
    dst: str,
    time_leave_min: str,
    time_leave_max: str
):
    return {'best_time': get_best_time(src, dst, time_leave_min, time_leave_max)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)