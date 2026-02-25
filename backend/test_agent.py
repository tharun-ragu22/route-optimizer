

import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_get_best_time():
    # Given pt B is driveable from pt A
    transport = ASGITransport(app=app)
    
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Define the query parameters
        params = {
            "src": "300 Kingston Rd, Pickering, ON L1V 1A2",
            "dst": "742 Kingston Rd, Pickering, ON L1V 1G4",
            "time_leave_min": "17:00",
            "time_leave_max": "17:15",
        }
                # When user puts A and B and time range they can leave
        response = await client.get("/get_best_time", params=params)
    
    # Then system tells them the time to leave to spend minimal time driving
    assert response.status_code == 200
    data = response.json()
    # assert data["source"] == "San Francisco"
    assert "best_time" in data