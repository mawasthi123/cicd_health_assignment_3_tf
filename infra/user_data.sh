#!/bin/bash
set -euxo pipefail

# Detect distro and install docker
if command -v apt-get >/dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y docker.io git curl
elif command -v yum >/dev/null 2>&1; then
  yum update -y || true
  amazon-linux-extras install docker -y || yum install -y docker git curl
else
  echo "Unsupported distro" >&2
  exit 1
fi
systemctl enable docker
systemctl start docker

# Install docker compose plugin if missing
if ! command -v docker compose >/dev/null 2>&1; then
  curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
  ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose || true
fi

mkdir -p /opt/app
cd /opt/app

# Clone repository (public) or update if exists
if [ ! -d .git ]; then
  git clone "${GITHUB_REPO_URL}" .
else
  git pull --rebase || true
fi

# Write backend .env
cat > backend/.env <<EOF
SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}
DATABASE_URL=sqlite:///./cicd_dashboard.db
CORS_ALLOW_ORIGINS=*
EOF

# Production compose and proxy
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
      - REACT_APP_API_URL
    restart: unless-stopped

  caddy:
    image: caddy:2
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
    depends_on:
      - backend
      - frontend
    restart: unless-stopped
EOF

cat > Caddyfile <<'EOF'
:80 {
  encode gzip
  handle_path /api/* {
    reverse_proxy backend:8000
  }
  route {
    reverse_proxy frontend:3000
  }
}
EOF

docker compose -f docker-compose.prod.yml up -d --build

