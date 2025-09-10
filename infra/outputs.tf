output "public_ip" {
  value       = aws_instance.app.public_ip
  description = "Public IP of the EC2 instance"
}

output "ssh_command" {
  value       = "ssh ec2-user@${aws_instance.app.public_ip}"
  description = "SSH command (assumes SSM or key configured)"
}

output "app_url" {
  value       = "http://${aws_instance.app.public_ip}"
  description = "App URL (HTTP via Caddy proxy)"
}

