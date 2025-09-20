#!/bin/bash
echo "Monitoring CI/CD Dashboard deployment..."
echo "Public IP: 43.205.192.163"
echo "Checking every 30 seconds..."
echo ""

for i in {1..20}; do
  echo "Attempt $i: $(date)"
  
  # Check health endpoint
  if curl -s http://43.205.192.163/health >/dev/null 2>&1; then
    echo "✅ Backend health check: PASSED"
    if curl -s http://43.205.192.163/api/metrics >/dev/null 2>&1; then
      echo "✅ API endpoint: PASSED"
      echo "🎉 Application is fully deployed and ready!"
      echo "🌐 Access your dashboard at: http://43.205.192.163"
      break
    else
      echo "⏳ Backend ready, API still loading..."
    fi
  else
    echo "⏳ Application still bootstrapping..."
  fi
  
  if [ $i -lt 20 ]; then
    echo "Waiting 30 seconds..."
    sleep 30
  fi
done

if [ $i -eq 20 ]; then
  echo "⚠️  Application may still be deploying. Check manually:"
  echo "   SSH: ssh -i key_cicd_health.pem ec2-user@43.205.192.163"
  echo "   Logs: sudo tail -f /var/log/user-data.log"
fi
