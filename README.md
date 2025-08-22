# CI/CD Pipeline Health Dashboard

A full-stack dashboard to monitor GitHub Actions pipeline executions, visualize metrics, and send email alerts on failures.

## Features
- Collects and displays build data (success/failure, build time, status)
- Real-time metrics: Success/Failure rate, Average build time, Last build status
- Slack alerting on pipeline failures
- React frontend dashboard
- FastAPI backend with SQLite
- Dockerized for easy local deployment

## Tech Stack
- Backend: Python (FastAPI)
- Frontend: React
- Database: SQLite
- Alerting: Slack (Webhook)
- Containerization: Docker, docker-compose

## Setup & Run Instructions

### Prerequisites
- Docker & Docker Compose installed

### 1. Clone the repository
```
git clone <your-repo-url>
cd cicd-health-dashboard
```

### 2. Configure Email (Optional)
Edit `backend/.env` with your Slack webhook URL for alerting.

### 3. Start the app (backend + frontend)
```
docker-compose up --build
```
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

### 4. Run Backend Tests
```
docker-compose run backend pytest
```

### 5. Run Frontend Tests
```
docker-compose run frontend npm test
```

## Jenkins Integration
This dashboard simulates CI/CD pipeline health using GitHub Actions data (simulated locally). Jenkins integration is **not required** for this demo, but the backend and data model are designed to be extensible for Jenkins or other CI/CD tools in the future.

## Architecture Summary
See `tech_design_document.md` for architecture, API, DB schema, and UI layout.

## How AI Tools Were Used
See `prompot_logs.md` for prompt logs and AI-assisted development notes.

## Key Learning and Assumptions
See `requirement_analysis_document.md` for requirement analysis and assumptions.
