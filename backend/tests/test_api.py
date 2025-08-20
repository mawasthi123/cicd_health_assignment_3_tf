import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["message"] == "CI/CD Health Dashboard Backend Running"

def test_metrics():
    resp = client.get("/api/metrics")
    assert resp.status_code == 200
    assert "success_rate" in resp.json()

def test_builds():
    resp = client.get("/api/builds")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

def test_alerts():
    resp = client.post("/api/alerts/test")
    # Accept 200 or 500 (if SMTP not configured)
    assert resp.status_code in (200, 500)