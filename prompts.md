# AI Prompts and Usage

This file captures representative prompts used with ChatGPT/Copilot/Cursor to generate and refine the IaC and deployment scripts.

## Examples

### Terraform VPC + EC2 (ChatGPT)
Prompt:
"Create Terraform for AWS free tier in ap-south-1: VPC (10.0.0.0/16), public subnet (10.0.1.0/24), IGW, route table, security group (80/443 open, SSH from my IP), and a t2.micro EC2 with user_data to install Docker and run docker compose to deploy a FastAPI+React app. Use templatefile for user_data variables. Output public IP and URL."

### User Data Script (Cursor)
Prompt:
"Write a robust cloud-init bash script that works on Amazon Linux 2023 and Ubuntu to install Docker and docker compose plugin, clone a public GitHub repo, write backend .env with SLACK_WEBHOOK_URL, start backend, frontend, and a Caddy reverse proxy mapping /api to backend:8000 and / to frontend:3000."

### Deployment Guide (Copilot)
Prompt:
"Draft a concise deployment.md for applying Terraform in ap-south-1, outlining prerequisites, commands, operations (SSH, rebuild), and troubleshooting steps."

---

During implementation we reviewed and adjusted generated snippets to match the repository structure and free-tier constraints (t2.micro, single AZ, SQLite DB).
