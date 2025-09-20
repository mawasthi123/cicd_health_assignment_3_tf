resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "${var.project_name}-igw"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = var.availability_zone
  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

resource "aws_db_subnet_group" "rds_subnets" {
  name       = "${var.project_name}-rds-subnets"
  subnet_ids = [aws_subnet.public.id, aws_subnet.public_alt.id]
  tags = {
    Name = "${var.project_name}-rds-subnets"
  }
}

resource "aws_subnet" "public_alt" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone       = var.availability_zone_alt
  tags = {
    Name = "${var.project_name}-public-subnet-alt"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_assoc_alt" {
  subnet_id      = aws_subnet.public_alt.id
  route_table_id = aws_route_table.public.id
}

