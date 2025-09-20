#!/bin/bash
echo "=== CI/CD Dashboard Deployment Monitor ==="
echo "Public IP: 43.205.192.163"
echo "Started: $(date)"
echo ""

for i in {1..30}; do
    echo "Check $i: $(date)"
    
    # Check if instance responds to HTTP
    if curl -s --connect-timeout 5 http://43.205.192.163/health >/dev/null 2>&1; then
        echo "✅ Health endpoint responding!"
        if curl -s --connect-timeout 5 http://43.205.192.163/api/metrics >/dev/null 2>&1; then
            echo "✅ API endpoint responding!"
            echo "🎉 APPLICATION IS READY!"
            echo "🌐 Dashboard URL: http://43.205.192.163"
            exit 0
        else
            echo "⏳ Health OK, API still loading..."
        fi
    else
        echo "⏳ Application still bootstrapping..."
    fi
    
    # Check SSH availability
    if timeout 3 ssh -i ~/.ssh/key_cicd_health.pem -o ConnectTimeout=2 -o StrictHostKeyChecking=no ec2-user@43.205.192.163 "echo 'SSH OK'" >/dev/null 2>&1; then
        echo "✅ SSH is now available"
    else
        echo "⏳ SSH not yet available"
    fi
    
    echo "Waiting 30 seconds..."
    sleep 30
done

echo "⚠️  Deployment taking longer than expected"
echo "You can manually check:"
echo "  SSH: ssh -i ~/.ssh/key_cicd_health.pem ec2-user@43.205.192.163"
echo "  URL: http://43.205.192.163"
