# CI/CD Pipeline Health Dashboard

A full-stack dashboard to monitor GitHub Actions pipeline executions, visualize metrics, and send email alerts on failures.

## Features
- Collects and displays build data (success/failure, build time, status)
- Real-time metrics: Success/Failure rate, Average build time, Last build status
- Email alerting on pipeline failures
- React frontend dashboard
- FastAPI backend with SQLite
- Dockerized for easy local deployment

## Tech Stack
- Backend: Python (FastAPI)
- Frontend: React
- Database: SQLite
- Alerting: Email (SMTP)
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
Edit `backend/.env` with your SMTP/email credentials for alerting.

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

## Architecture Summary
See `tech_design_document.md` for architecture, API, DB schema, and UI layout.

## How AI Tools Were Used
See `prompot_logs.md` for prompt logs and AI-assisted development notes.

## Key Learning and Assumptions
See `requirement_analysis_document.md` for requirement analysis and assumptions.
