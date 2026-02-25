from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/get_best_time")
def get_best_time(
    src: str,
    dst: str,
    time: str
):
    pass

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)