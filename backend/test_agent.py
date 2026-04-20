

import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_get_best_time_happy_path():
    # Given pt B is driveable from pt A
    print('starting test')
    # return
    transport = ASGITransport(app=app)
    
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Define the query parameters
        params = {
            "src_lat": 43.809121399999995,
            "src_lng": -79.13123209999999,
            "dst_lat": 43.8210944,
            "dst_lng": -79.1137687,
            "time_leave_min": "17:00",
            "time_leave_max": "17:15",
        }
                # When user puts A and B and time range they can leave
        response = await client.get("/get_best_time", params=params)
    
    # Then system tells them the time to leave to spend minimal time driving
    print("response:", response)
    assert response.status_code == 200
    data = response.json()
    # assert data["source"] == "San Francisco"
    assert "best_time" in data

@pytest.mark.asyncio
async def test_get_best_time_not_driveable():
    # Given pt B is not driveable from pt A
    print('starting test')
    # return
    transport = ASGITransport(app=app)
    
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        
        params = {
           "src_lat": 43.809121399999995,
            "src_lng": -79.13123209999999,
            "dst_lat": 53.3431264,
            "dst_lng": -6.2817019,
            "time_leave_min": "17:00",
            "time_leave_max": "17:15",
        }
        # When user puts A and B and time range they can leavee
        response = await client.get("/get_best_time", params=params)
    
    # Then system tells them they cannot find a match
    print("response:", response)
    assert response.status_code == 400