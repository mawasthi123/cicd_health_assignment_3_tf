from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud, database, github, alerting
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Allow frontend to access backend
origins = os.getenv("CORS_ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "CI/CD Health Dashboard Backend Running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Backend is running"}

@app.get("/api/metrics")
def get_metrics(db: Session = Depends(get_db)):
    builds = crud.get_builds(db)
    if not builds:
        # Use mock data if DB is empty
        builds = github.get_mock_builds()
    total = len(builds)
    if total == 0:
        return {"success_rate": 0, "failure_rate": 0, "avg_build_time": 0, "last_build_status": None}
    
    # Handle both dict objects (mock data) and ORM objects (database)
    success = sum(1 for b in builds if (b.status if hasattr(b, 'status') else b["status"]) == "success")
    failure = sum(1 for b in builds if (b.status if hasattr(b, 'status') else b["status"]) == "failure")
    avg_time = sum((b.duration if hasattr(b, 'duration') else b["duration"]) for b in builds if (b.duration if hasattr(b, 'duration') else b["duration"])) / total
    last_status = builds[-1].status if hasattr(builds[-1], 'status') else builds[-1]["status"]
    
    return {
        "success_rate": round(success / total * 100, 2),
        "failure_rate": round(failure / total * 100, 2),
        "avg_build_time": round(avg_time, 2),
        "last_build_status": last_status
    }

@app.get("/api/builds", response_model=list[schemas.Build])
def get_builds(db: Session = Depends(get_db)):
    builds = crud.get_builds(db)
    if not builds:
        # Return mock builds if DB is empty
        return github.get_mock_builds()
    return builds

@app.get("/api/builds/{build_id}/logs")
def get_build_logs(build_id: int, db: Session = Depends(get_db)):
    # First try to get from database
    build = crud.get_build(db, build_id)
    if not build:
        # If not in database, check mock data
        mock_builds = github.get_mock_builds()
        mock_build = next((b for b in mock_builds if b["id"] == build_id), None)
        if not mock_build:
            raise HTTPException(status_code=404, detail="Build not found")
        return {"logs": mock_build["logs"]}
    
    # Return logs from database
    return {"logs": build.logs}

@app.post("/api/alerts/test")
def test_alert():
    try:
        alerting.send_slack_alert(
            "This is a test alert from the CI/CD Health Dashboard."
        )
        return {"message": "Test Slack alert sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))