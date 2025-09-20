#!/bin/bash
set -e

# Log everything to a file for debugging
exec > >(tee /var/log/user-data.log) 2>&1
echo "Starting user data script at $(date)"

# Update system
yum update -y

# Install required packages
yum install -y git curl wget

# Install Docker
amazon-linux-extras install docker -y
systemctl enable docker
systemctl start docker
usermod -a -G docker ec2-user

# Wait for Docker to be ready
sleep 10
docker --version

# Install Docker Compose (standalone binary)
curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version

# Create app directory
mkdir -p /opt/app
cd /opt/app

# Clone repository
echo "Cloning repository..."
git clone https://github.com/mawasthi123/cicd_health_assignment_3_tf.git .
ls -la

# Wait for RDS to be ready (get endpoint dynamically)
echo "Waiting for RDS endpoint..."
RDS_ENDPOINT=""
for i in {1..30}; do
    RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier cicd-health-dashboard-db --query 'DBInstances[0].Endpoint.Address' --output text 2>/dev/null || echo "")
    if [ -n "$RDS_ENDPOINT" ] && [ "$RDS_ENDPOINT" != "None" ]; then
        echo "RDS endpoint found: $RDS_ENDPOINT"
        break
    fi
    echo "Waiting for RDS endpoint... attempt $i"
    sleep 10
done

# Create backend .env file
echo "Creating backend .env file..."
cat > backend/.env <<EOF
SLACK_WEBHOOK_URL=
DATABASE_URL=postgresql+psycopg2://appuser:SecurePass123@${RDS_ENDPOINT}:5432/cicd_dashboard
CORS_ALLOW_ORIGINS=*
EOF

# Create production docker-compose
echo "Creating docker-compose.prod.yml..."
cat > docker-compose.prod.yml <<'EOF'
services:
  backend:
    build: ./backend
    container_name: cicd-backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: cicd-frontend
    environment:
      - REACT_APP_API_URL=
    restart: unless-stopped

  caddy:
    image: caddy:2
    container_name: caddy
    ports:
      - "80:80"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
    depends_on:
      - backend
      - frontend
    restart: unless-stopped
EOF

# Create Caddyfile
echo "Creating Caddyfile..."
cat > Caddyfile <<'EOF'
:80 {
  encode gzip
  
  # Health check endpoint
  handle /health {
    respond "OK" 200
  }
  
  # API routes
  handle_path /api/* {
    reverse_proxy backend:8000
  }
  
  # Frontend routes
  route {
    reverse_proxy frontend:3000
  }
}
EOF

# Build and start containers
echo "Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for containers to be ready
echo "Waiting for containers to start..."
sleep 30

# Check container status
echo "Container status:"
docker ps

# Test the application
echo "Testing application..."
for i in {1..10}; do
    if curl -f http://localhost:80/health 2>/dev/null; then
        echo "Application is ready!"
        break
    fi
    echo "Waiting for application... attempt $i"
    sleep 30
done

echo "User data script completed at $(date)"
