variable "project_name" {
  type        = string
  description = "Project name prefix for resources"
  default     = "cicd-health-dashboard"
}

variable "aws_region" {
  type        = string
  description = "AWS region to deploy to"
  default     = "ap-south-1"
}

variable "availability_zone" {
  type        = string
  description = "AZ for the public subnet"
  default     = "ap-south-1a"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR allowed to SSH (22). Set to your IP/32."
  default     = "0.0.0.0/0"
}

variable "enable_ssh" {
  type        = bool
  description = "Whether to open port 22 (SSH). If false, use SSM only."
  default     = true
}

variable "ssh_key_pair_name" {
  type        = string
  description = "Existing AWS key pair name for SSH access"
  default     = null
}

variable "use_reverse_proxy" {
  type        = bool
  description = "Whether to run Caddy reverse proxy on port 80."
  default     = true
}

variable "github_repo_url" {
  type        = string
  description = "Public Git repository URL to clone on the instance"
  default     = "https://github.com/your-org/your-repo.git"
}

variable "slack_webhook_url" {
  type        = string
  description = "Slack webhook URL for alerts"
  default     = ""
  sensitive   = true
}

