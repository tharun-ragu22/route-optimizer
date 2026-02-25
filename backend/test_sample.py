
from agent import get_best_time


def test_AtoBIsDriveable_PointsAandB_MinimumDrivingTime():
    # Given pt B is driveable from pt A
    A="470 Kingston Rd, Pickering, ON L1V 1A5"
    B="557 Kingston Rd, Pickering, ON L1V 3N7"
    # Then system tells them the time to leave to spend minimal time driving
    min_time = get_best_time(A,B)
    # When user puts A and B and time range they can leave
    assert min_time < 5