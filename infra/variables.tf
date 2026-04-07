variable "aws_region" {
  description = "AWS region"
  default     = "eu-central-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_pair_name" {
  description = "Name of the AWS key pair for SSH access"
  type        = string
  default     = "makemyday-key"
}