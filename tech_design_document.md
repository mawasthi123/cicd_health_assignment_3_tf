# Tech Design Document

## High-Level Architecture
- **Backend (FastAPI):** Handles API requests, stores build data, triggers email alerts
- **Database (SQLite):** Stores pipelines, builds, and alert logs
- **Frontend (React):** Visualizes metrics, build status, and logs
- **Alerting:** Sends email notifications on failures

## API Structure
- `GET /api/metrics` – Returns success/failure rate, avg build time, last build status
- `GET /api/builds` – Lists recent builds with status, duration, and logs
- `GET /api/builds/{id}/logs` – Returns logs for a specific build
- `POST /api/alerts/test` – Triggers a test email alert

## Database Schema
- **pipelines**: id, name, provider, repo, created_at
- **builds**: id, pipeline_id, status, duration, started_at, finished_at, logs
- **alerts**: id, build_id, sent_at, type, status

## UI Layout
- **Dashboard:** Cards for Success/Failure rate, Avg build time, Last build status
- **Builds Table:** List of recent builds with status, duration, and log links
- **Alert Banner:** Notification for recent failures
- **Log Viewer:** Modal or section to display build logs

## Extensibility
- Can add support for more CI/CD tools (Jenkins, etc.)
- Can switch to PostgreSQL for production
- Can add Slack alerting or other integrations