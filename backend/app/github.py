# This module will simulate or poll GitHub Actions data for local development.
# For now, it can provide mock build data for the dashboard.

def get_mock_builds():
    return [
        {
            "id": 1,
            "pipeline_id": 1,
            "status": "success",
            "duration": 120.5,
            "started_at": "2024-06-01T10:00:00",
            "finished_at": "2024-06-01T10:02:00",
            "logs": "Build completed successfully."
        },
        {
            "id": 2,
            "pipeline_id": 1,
            "status": "failure",
            "duration": 95.0,
            "started_at": "2024-06-02T11:00:00",
            "finished_at": "2024-06-02T11:01:35",
            "logs": "Build failed due to test errors."
        }
    ]