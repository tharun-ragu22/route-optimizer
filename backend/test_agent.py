
# from agent import get_best_time


# def test_AtoBIsDriveable_PointsAandB_MinimumDrivingTime():
#     # Given pt B is driveable from pt A
#     A="470 Kingston Rd, Pickering, ON L1V 1A5"
#     B="557 Kingston Rd, Pickering, ON L1V 3N7"
#     # Then system tells them the time to leave to spend minimal time driving
#     min_time = get_best_time(A,B)
#     # When user puts A and B and time range they can leave
#     assert min_time < 5

import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_get_best_time():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Define the query parameters
        params = {
            "src": "300 Kingston Rd, Pickering, ON L1V 1A2",
            "dst": "742 Kingston Rd, Pickering, ON L1V 1G4",
            "time": "2026-05-01T12:00:00"
        }
        
        response = await client.get("/get_best_time", params=params)
    
    assert response.status_code == 200
    data = response.json()
    # assert data["source"] == "San Francisco"
    assert "estimated_duration" in data