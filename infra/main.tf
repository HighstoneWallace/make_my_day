terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "makemyday-tfstate-bhn"
    key            = "makemyday/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "makemyday-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# Security group to control inbound/outbound traffic
resource "aws_security_group" "makemyday" {
  name        = "makemyday-sg"
  description = "MakeMyDay application security group"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_instance_profile" "makemyday" {
  name = "makemyday-instance-profile"
  role = "makemyday-ec2-role"
}

resource "aws_iam_role_policy_attachment" "polly" {
  role       = "makemyday-ec2-role"
  policy_arn = "arn:aws:iam::aws:policy/AmazonPollyReadOnlyAccess"
}


# EC2 instance
resource "aws_instance" "makemyday" {
  ami                    = "ami-0084a47cc718c111a" # Ubuntu 24.04 LTS eu-central-1
  instance_type          = var.instance_type
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.makemyday.id]
  iam_instance_profile   = aws_iam_instance_profile.makemyday.name

user_data = <<-EOF
  #!/bin/bash
  apt-get update
  apt-get install -y ca-certificates curl gnupg unzip
  
  # Docker
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | tee /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl start docker
  systemctl enable docker
  usermod -aG docker ubuntu

  # AWS CLI
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  ./aws/install
  rm -rf awscliv2.zip aws/

  echo "0 5 * * * curl -s http://localhost:8000/api/briefing >> /home/ubuntu/briefing.log 2>&1" | crontab -u ubuntu -

EOF

  tags = {
    Name = "makemyday"
  }
}