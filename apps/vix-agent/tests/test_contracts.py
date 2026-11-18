from vix_agent.contracts import ScreenMap


def test_screenmap_ids():
    sm = ScreenMap.model_validate({
        "screen": "D1", "route": "/app/x/phy.pendulum.g/lab", "mode": "GRADED", "viewport": {"w": 1440, "h": 900},
        "regions": [{"id": "bench", "label": "Lab bench", "kind": "panel", "bbox": [0, 0, 10, 10], "visible": True}],
    })
    assert sm.has_id("bench") and sm.has_id("bench.bob") and not sm.has_id("dock")
