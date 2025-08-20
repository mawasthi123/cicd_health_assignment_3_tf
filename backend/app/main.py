from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud, database, github, alerting
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.get("/api/metrics")
def get_metrics(db: Session = Depends(get_db)):
    builds = crud.get_builds(db)
    if not builds:
        # Use mock data if DB is empty
        builds = github.get_mock_builds()
    total = len(builds)
    if total == 0:
        return {"success_rate": 0, "failure_rate": 0, "avg_build_time": 0, "last_build_status": None}
    success = sum(1 for b in builds if b.status == "success")
    failure = sum(1 for b in builds if b.status == "failure")
    avg_time = sum(b.duration for b in builds if b.duration) / total
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
    build = crud.get_build(db, build_id)
    if not build:
        raise HTTPException(status_code=404, detail="Build not found")
    return {"logs": build.logs}

@app.post("/api/alerts/test")
def test_alert():
    to_email = os.getenv("ALERT_TO_EMAIL", "recipient@example.com")
    try:
        alerting.send_email_alert(
            subject="Test CI/CD Pipeline Alert",
            body="This is a test alert from the CI/CD Health Dashboard.",
            to_email=to_email
        )
        return {"message": f"Test alert sent to {to_email}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))