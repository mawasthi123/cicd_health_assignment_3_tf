data "aws_ami" "linux" {
  most_recent = true
  owners      = ["137112412989"] # Amazon Linux 2/2023

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_db_instance" "postgres" {
  identifier              = "${var.project_name}-db"
  engine                  = "postgres"
  engine_version          = var.rds_engine_version
  instance_class          = var.rds_instance_class
  allocated_storage       = 20
  db_name                 = var.db_name
  username                = var.db_username
  password                = var.db_password
  port                    = 5432
  db_subnet_group_name    = aws_db_subnet_group.rds_subnets.name
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  publicly_accessible     = false
  backup_retention_period = 0
  skip_final_snapshot     = true
  deletion_protection     = false
  apply_immediately       = true
  multi_az                = false
  tags = {
    Name = "${var.project_name}-rds"
  }
}

resource "aws_security_group" "allow_vpc_endpoint" {
  # placeholder to ensure dependency graph clarity if needed later
  vpc_id = aws_vpc.main.id
}

resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "ec2.amazonaws.com" },
      Action   = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

locals {
  user_data_rendered = base64encode(file("${path.module}/user_data.sh"))
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.linux.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  user_data              = local.user_data_rendered
  key_name               = var.ssh_key_pair_name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.project_name}-ec2"
  }
}

