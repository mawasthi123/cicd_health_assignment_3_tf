# CI/CD Pipeline Health Dashboard

A full-stack dashboard to monitor CI/CD pipeline executions, visualize metrics, and send alerts on failures. Now with **AWS Infrastructure-as-Code deployment** using Terraform!

## 🚀 New Features (Assignment 3)

### ✅ AWS Cloud Deployment
- **Infrastructure-as-Code**: Complete Terraform configuration
- **AWS Services**: EC2, RDS PostgreSQL, VPC, Security Groups
- **Production Ready**: Docker containers with reverse proxy (Caddy)
- **Auto-scaling Ready**: Designed for easy scaling and recreation

### ✅ Enhanced Architecture
- **Managed Database**: RDS PostgreSQL (replaces SQLite)
- **Reverse Proxy**: Caddy for production-grade routing
- **Health Checks**: Built-in monitoring and health endpoints
- **Dynamic Monitoring**: Auto-detects infrastructure changes

## 📊 Features

* **Real-time Metrics**: Success/Failure rate, Average build time, Last build status
* **Build History**: Complete pipeline execution history with logs
* **Alerting System**: Slack webhook integration for failures
* **Responsive Dashboard**: Modern React frontend with charts
* **Production Deployment**: AWS cloud infrastructure
* **Infrastructure-as-Code**: Complete Terraform automation

## 🏗️ Tech Stack

### Application
* **Backend**: Python (FastAPI)
* **Frontend**: React with modern UI components
* **Database**: PostgreSQL (RDS) / SQLite (local dev)
* **Alerting**: Slack Webhook integration
* **Containerization**: Docker, Docker Compose

### Infrastructure
* **Cloud Provider**: AWS
* **Infrastructure**: Terraform
* **Compute**: EC2 (t2.micro)
* **Database**: RDS PostgreSQL (db.t3.micro)
* **Networking**: VPC, Public Subnets, Security Groups
* **Reverse Proxy**: Caddy
* **Monitoring**: Dynamic health checks

## 🚀 Quick Start

### Option 1: Local Development
```bash
git clone https://github.com/mawasthi123/mayank_cicd-health-dashboard.git
cd mayank_cicd-health-dashboard
docker-compose up --build
```

### Option 2: AWS Cloud Deployment
```bash
git clone https://github.com/mawasthi123/mayank_cicd-health-dashboard.git
cd mayank_cicd-health-dashboard/infra

# Configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Deploy to AWS
terraform init
terraform plan
terraform apply

# Monitor deployment
./monitor_dynamic.sh
```

## 📁 Project Structure

```
mayank_cicd-health-dashboard/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # API endpoints
│   │   ├── models.py       # Database models
│   │   ├── database.py     # DB connection (SQLite/PostgreSQL)
│   │   └── ...
│   ├── Dockerfile          # Production-ready container
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Dashboard components
│   │   ├── api.js         # API client
│   │   └── ...
│   └── Dockerfile         # Production build
├── infra/                 # Terraform infrastructure
│   ├── ec2.tf            # EC2 instance configuration
│   ├── vpc.tf            # VPC and networking
│   ├── security.tf       # Security groups
│   ├── user_data.sh      # EC2 bootstrap script
│   └── monitor_dynamic.sh # Dynamic monitoring
├── docker-compose.yml     # Local development
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/db
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
CORS_ALLOW_ORIGINS=*
```

### Terraform Variables
```hcl
# infra/terraform.tfvars
aws_region = "ap-south-1"
instance_type = "t2.micro"
db_password = "your-secure-password"
ssh_key_pair_name = "your-key-pair"
```

## 📊 API Endpoints

* `GET /api/metrics` - Pipeline metrics (success rate, build time)
* `GET /api/builds` - Build history with logs
* `POST /api/alerts/test` - Test alert functionality
* `GET /health` - Health check endpoint

## 🛠️ Infrastructure Management

### Deploy Infrastructure
```bash
cd infra
terraform apply
```

### Monitor Application
```bash
./monitor_dynamic.sh
```

### Destroy Infrastructure
```bash
terraform destroy
```

### Recreate Infrastructure
```bash
terraform destroy
terraform apply
./monitor_dynamic.sh
```

## 🧪 Testing

### Backend Tests
```bash
docker-compose run backend pytest
```

### Frontend Tests
```bash
docker-compose run frontend npm test
```

### Integration Tests
```bash
# Test API endpoints
curl http://your-app-url/api/metrics
curl http://your-app-url/api/builds
```

## 📈 Monitoring & Alerts

* **Health Checks**: Built-in endpoint monitoring
* **Dynamic Monitoring**: Auto-detects infrastructure changes
* **Slack Integration**: Real-time failure notifications
* **Metrics Dashboard**: Visual pipeline health indicators

## 🔄 CI/CD Integration

This dashboard is designed to integrate with:
* **GitHub Actions** (simulated data included)
* **Jenkins** (extensible architecture)
* **GitLab CI** (API-compatible)
* **Azure DevOps** (configurable endpoints)

## 🚀 Production Deployment

### AWS Free Tier Compatible
- **EC2**: t2.micro (750 hours/month free)
- **RDS**: db.t3.micro (750 hours/month free)
- **Data Transfer**: 1GB/month free
- **Storage**: 30GB free

### Security Features
- **VPC**: Isolated network environment
- **Security Groups**: Restrictive firewall rules
- **IAM Roles**: Least privilege access
- **HTTPS Ready**: Caddy reverse proxy

## 📚 Documentation

* `requirement_analysis_document.md` - Requirements and assumptions
* `tech_design_document.md` - Architecture and design decisions
* `infra/RECREATION_GUIDE.md` - Infrastructure recreation guide
* `prompot_logs.md` - AI-assisted development logs

## 🤖 AI-Native Development

This project was developed using AI-native tools:
* **ChatGPT**: Code generation and debugging
* **GitHub Copilot**: Real-time code assistance
* **Cursor**: AI-powered IDE features
* **Terraform**: Infrastructure automation

## 🎯 Assignment 3 Achievements

✅ **Infrastructure-as-Code**: Complete Terraform configuration  
✅ **Cloud Deployment**: AWS with Free Tier resources  
✅ **Containerized Application**: Docker + Docker Compose  
✅ **Public Access**: Application accessible via public IP  
✅ **Managed Database**: RDS PostgreSQL integration  
✅ **AI-Native Tools**: Used throughout development  
✅ **Production Ready**: Reverse proxy, health checks, monitoring  
✅ **Recreation Ready**: Dynamic monitoring and documentation  

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the recreation guide for infrastructure issues
3. Use the dynamic monitoring script for status checks

## 📄 License

This project is part of an educational assignment demonstrating modern DevOps practices with AI-native development tools.

---

**Live Demo**: Deploy to AWS and access your dashboard at the provided public IP!
