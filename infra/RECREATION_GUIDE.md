# Infrastructure Recreation Guide

## Overview
This guide explains how to safely destroy and recreate the CI/CD Health Dashboard infrastructure.

## ⚠️ Important Notes

### What Changes After Recreation:
- **Public IP Address**: Will be different (e.g., from 43.205.192.163 to a new IP)
- **RDS Endpoint**: Will remain the same (managed service)
- **All other resources**: Will be recreated with new IDs

### What Stays the Same:
- **Application Code**: No changes needed
- **Terraform Configuration**: No changes needed
- **Database Data**: Will be lost (using mock data anyway)

## 🔄 Recreation Process

### 1. Destroy Current Infrastructure
```bash
cd infra
terraform destroy
# Type 'yes' when prompted
```

### 2. Recreate Infrastructure
```bash
terraform apply
# Type 'yes' when prompted
```

### 3. Get New Access Information
```bash
# Use the dynamic monitoring script (recommended)
./monitor_dynamic.sh

# Or get specific outputs
terraform output public_ip
terraform output instance_id
```

## 🛠️ Monitoring

### Dynamic Monitoring Script (Only Script Available)
```bash
./monitor_dynamic.sh
```
- Automatically gets current public IP from Terraform state
- Works after any recreation
- No manual updates needed
- **This is the only monitoring script you need!**

## 🔧 Troubleshooting

### If Application Doesn't Work After Recreation:
1. Check if containers are running:
   ```bash
   ssh -i ~/.ssh/key_cicd_health.pem ec2-user@<NEW_IP>
   docker ps
   ```

2. Check container logs:
   ```bash
   docker logs cicd-backend
   docker logs cicd-frontend
   docker logs caddy
   ```

3. Restart containers if needed:
   ```bash
   cd /opt/app
   docker compose -f docker-compose.prod.yml restart
   ```

## ✅ Best Practices

1. **Always use `monitor_dynamic.sh`** for checking status
2. **Save the new public IP** from `terraform output public_ip`
3. **Test all endpoints** after recreation
4. **Keep SSH key accessible** for troubleshooting

## 🚀 Quick Recreation Commands

```bash
# Complete recreation process
cd infra
terraform destroy -auto-approve
terraform apply -auto-approve
./monitor_dynamic.sh
```

## 📝 Note
- Old monitoring scripts with hardcoded IPs have been removed
- Only `monitor_dynamic.sh` is available and recommended
- This script automatically adapts to any new public IP after recreation
