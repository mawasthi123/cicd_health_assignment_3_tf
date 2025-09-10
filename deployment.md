# Deployment Guide (AWS Free Tier – ap-south-1)

This guide provisions AWS infrastructure with Terraform and automatically deploys the CI/CD Pipeline Health Dashboard using Docker and Caddy (HTTP reverse proxy).

## Prerequisites
- AWS account with Free Tier
- IAM user/role with permissions for EC2, VPC, IAM, SSM
- AWS CLI configured (aws configure) for ap-south-1
- Terraform >= 1.6

## Structure
- infra/ Terraform IaC
  - providers.tf, variables.tf, vpc.tf, security.tf, ec2.tf, outputs.tf, user_data.sh
- App repo includes Dockerfiles and docker-compose.yml

## Quick Start
1) Edit variables (optional): infra/variables.tf
   - github_repo_url (Set to this repo URL)
   - allowed_ssh_cidr (restrict SSH to your IP/32)
   - ssh_key_pair_name (existing AWS key pair for SSH)
   - availability_zone (defaults to region a)
   - slack_webhook_url (optional)

2) Initialize and apply:
```bash
cd infra
terraform init
terraform validate
terraform validate
terraform plan -out tfplan \
  -var="project_name=cicd-health-dashboard" \
  -var="aws_region=ap-south-1" \
  -var="instance_type=t2.micro" \
  -var="github_repo_url=https://github.com/your-org/your-repo.git" \
  -var="allowed_ssh_cidr=YOUR.IP.ADDR.XX/32" \
  -var="ssh_key_pair_name=YOUR_KEYPAIR_NAME" \
  -var="slack_webhook_url="
# DO NOT APPLY if you're reviewing only. To deploy, run:
# terraform apply tfplan
```

3) Outputs will show:
- public_ip: EC2 public IP
- app_url: http://PUBLIC_IP

Open the URL in a browser. Caddy proxies:
- /api/* -> backend (FastAPI on 8000)
- / -> frontend (React dev server on 3000)

## Operations
- SSH (if enabled):
```bash
ssh ec2-user@PUBLIC_IP
```
- Update app on instance:
```bash
cd /opt/app
sudo docker compose -f docker-compose.prod.yml up -d --build
```
- Destroy infra:
```bash
cd infra
terraform destroy
```

## Notes
- DB: SQLite file in backend container; DATABASE_URL configurable in infra/user_data.sh template.
- For HTTPS and a domain, add Route53 + switch Caddy to automatic TLS.
- To avoid building on the instance, push images to Docker Hub and update docker-compose.prod.yml services to use images instead of build.

## Troubleshooting
- Instance up but app not loading: check security group allows port 80.
- Logs:
```bash
ssh ec2-user@PUBLIC_IP
sudo docker ps
sudo docker logs -f cicd-backend
sudo docker logs -f cicd-frontend
sudo docker logs -f caddy
```
- User data not executed: verify cloud-init logs on instance: /var/log/cloud-init-output.log
