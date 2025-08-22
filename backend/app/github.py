# This module will simulate or poll GitHub Actions data for local development.
# For now, it can provide mock build data for the dashboard.

def get_mock_builds():
    return [
        {
            "id": 1,
            "pipeline_id": 1,
            "status": "success",
            "duration": 120.5,
            "started_at": "2024-01-15T10:00:00",
            "finished_at": "2024-01-15T10:02:00",
            "logs": "Build completed successfully. All tests passed. Deployed to staging environment."
        },
        {
            "id": 2,
            "pipeline_id": 1,
            "status": "failure",
            "duration": 95.0,
            "started_at": "2024-01-15T14:30:00",
            "finished_at": "2024-01-15T14:31:35",
            "logs": "Build failed due to test errors. Unit tests failed on user authentication module."
        },
        {
            "id": 3,
            "pipeline_id": 1,
            "status": "success",
            "duration": 145.2,
            "started_at": "2024-01-16T09:15:00",
            "finished_at": "2024-01-16T09:17:25",
            "logs": "Build successful. Integration tests passed. Performance tests completed within acceptable limits."
        },
        {
            "id": 4,
            "pipeline_id": 2,
            "status": "success",
            "duration": 88.7,
            "started_at": "2024-01-16T15:45:00",
            "finished_at": "2024-01-16T15:46:28",
            "logs": "Frontend build completed. Bundle size optimized. Lighthouse score: 95/100."
        },
        {
            "id": 5,
            "pipeline_id": 2,
            "status": "failure",
            "duration": 67.3,
            "started_at": "2024-01-17T08:20:00",
            "finished_at": "2024-01-17T08:21:07",
            "logs": "Build failed: ESLint errors detected. Code formatting issues in components."
        },
        {
            "id": 6,
            "pipeline_id": 1,
            "status": "success",
            "duration": 132.8,
            "started_at": "2024-01-17T11:30:00",
            "finished_at": "2024-01-17T11:32:12",
            "logs": "Backend build successful. Database migrations applied. API documentation generated."
        },
        {
            "id": 7,
            "pipeline_id": 3,
            "status": "success",
            "duration": 76.4,
            "started_at": "2024-01-17T16:00:00",
            "finished_at": "2024-01-17T16:01:16",
            "logs": "Mobile app build completed. iOS and Android builds generated successfully."
        },
        {
            "id": 8,
            "pipeline_id": 1,
            "status": "failure",
            "duration": 89.1,
            "started_at": "2024-01-18T10:15:00",
            "finished_at": "2024-01-18T10:16:29",
            "logs": "Build failed: Security scan detected vulnerable dependencies. Update required."
        },
        {
            "id": 9,
            "pipeline_id": 2,
            "status": "success",
            "duration": 92.3,
            "started_at": "2024-01-18T14:20:00",
            "finished_at": "2024-01-18T14:21:32",
            "logs": "Frontend build successful. Accessibility tests passed. Cross-browser compatibility verified."
        },
        {
            "id": 10,
            "pipeline_id": 1,
            "status": "success",
            "duration": 156.7,
            "started_at": "2024-01-19T09:00:00",
            "finished_at": "2024-01-19T09:02:36",
            "logs": "Full stack build completed. End-to-end tests passed. Load testing completed successfully."
        },
        {
            "id": 11,
            "pipeline_id": 4,
            "status": "success",
            "duration": 45.2,
            "started_at": "2024-01-19T13:30:00",
            "finished_at": "2024-01-19T13:30:45",
            "logs": "Infrastructure build successful. Terraform plan applied. Cloud resources provisioned."
        },
        {
            "id": 12,
            "pipeline_id": 1,
            "status": "failure",
            "duration": 78.9,
            "started_at": "2024-01-20T08:45:00",
            "finished_at": "2024-01-20T08:46:18",
            "logs": "Build failed: Database connection timeout during integration tests."
        },
        {
            "id": 13,
            "pipeline_id": 2,
            "status": "success",
            "duration": 103.4,
            "started_at": "2024-01-20T12:15:00",
            "finished_at": "2024-01-20T12:16:43",
            "logs": "Frontend build successful. PWA features implemented. Service worker registered."
        },
        {
            "id": 14,
            "pipeline_id": 3,
            "status": "failure",
            "duration": 112.6,
            "started_at": "2024-01-20T16:00:00",
            "finished_at": "2024-01-20T16:01:52",
            "logs": "Mobile build failed: React Native version compatibility issues detected."
        },
        {
            "id": 15,
            "pipeline_id": 1,
            "status": "success",
            "duration": 167.3,
            "started_at": "2024-01-21T09:30:00",
            "finished_at": "2024-01-21T09:32:47",
            "logs": "Backend build successful. Microservices deployed. Health checks passed."
        },
        {
            "id": 16,
            "pipeline_id": 5,
            "status": "success",
            "duration": 34.8,
            "started_at": "2024-01-21T14:00:00",
            "finished_at": "2024-01-21T14:00:34",
            "logs": "Documentation build successful. API docs updated. README files generated."
        },
        {
            "id": 17,
            "pipeline_id": 1,
            "status": "success",
            "duration": 143.9,
            "started_at": "2024-01-22T10:00:00",
            "finished_at": "2024-01-22T10:02:23",
            "logs": "Full system build completed. All services deployed. Monitoring configured."
        },
        {
            "id": 18,
            "pipeline_id": 2,
            "status": "success",
            "duration": 87.2,
            "started_at": "2024-01-22T15:30:00",
            "finished_at": "2024-01-22T15:31:27",
            "logs": "Frontend build successful. Internationalization implemented. RTL support added."
        },
        {
            "id": 19,
            "pipeline_id": 1,
            "status": "failure",
            "duration": 91.4,
            "started_at": "2024-01-23T08:00:00",
            "finished_at": "2024-01-23T08:01:31",
            "logs": "Build failed: Memory leak detected during performance testing."
        },
        {
            "id": 20,
            "pipeline_id": 1,
            "status": "success",
            "duration": 138.6,
            "started_at": "2024-01-23T11:45:00",
            "finished_at": "2024-01-23T11:47:18",
            "logs": "Latest build successful. All tests passed. Production deployment ready."
        }
    ]