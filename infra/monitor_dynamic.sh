#!/bin/bash

# Dynamic monitoring script that gets the current public IP from Terraform state
set -e

echo "🔍 Getting current infrastructure details from Terraform..."

# Get the current public IP from Terraform state
PUBLIC_IP=$(terraform output -raw public_ip 2>/dev/null || echo "")
INSTANCE_ID=$(terraform output -raw instance_id 2>/dev/null || echo "")

if [ -z "$PUBLIC_IP" ]; then
    echo "❌ Error: Could not get public IP from Terraform state"
    echo "   Make sure you're in the infra directory and have run 'terraform apply'"
    exit 1
fi

echo "📍 Current Infrastructure:"
echo "   Instance ID: $INSTANCE_ID"
echo "   Public IP: $PUBLIC_IP"
echo ""

# Test application endpoints
echo "🧪 Testing application endpoints..."

if curl -s --connect-timeout 5 http://$PUBLIC_IP/health >/dev/null 2>&1; then
    echo "✅ Frontend is accessible"
    if curl -s --connect-timeout 5 http://$PUBLIC_IP/api/metrics >/dev/null 2>&1; then
        echo "✅ Backend API is working"
        echo "🌐 Dashboard URL: http://$PUBLIC_IP"
    else
        echo "❌ Backend API is not responding"
    fi
else
    echo "❌ Frontend is not accessible"
fi

echo ""
echo "🔗 Access Information:"
echo "   Dashboard: http://$PUBLIC_IP"
echo "   SSH: ssh -i ~/.ssh/key_cicd_health.pem ec2-user@$PUBLIC_IP"
echo "   API Health: http://$PUBLIC_IP/api/metrics"
echo "   API Builds: http://$PUBLIC_IP/api/builds"
