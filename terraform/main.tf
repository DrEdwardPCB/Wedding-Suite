terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.6.0"
    }
  }

  required_version = ">= 1.3.0"
}

provider "aws" {
  region = "us-east-1"
  s3_use_path_style = true
}

provider "mongodbatlas" {
  public_key  = var.mongodb_public_key
  private_key = var.mongodb_private_key
}

variable "mongodb_public_key" {}
variable "mongodb_private_key" {}
variable "mongodb_org_id" {}
variable "mongodb_project_id" {}

# MongoDB Atlas Cluster
resource "mongodbatlas_cluster" "atlas_cluster" {
  project_id   = var.mongodb_project_id
  name         = "ekwedding-app-cluster"
  cluster_type = "REPLICASET"

  provider_instance_size_name = "M0"
  provider_name = "TENANT"
  backing_provider_name = "AWS"
  provider_region_name        = "US_EAST_1"

}

# MongoDB Atlas Database User
resource "mongodbatlas_database_user" "db_user" {
  project_id = var.mongodb_project_id
  username   = "ekwedding-user"
  password   = random_password.db_password.result
  auth_database_name = "admin"
  roles {
    role_name     = "readWrite"
    database_name = "mydatabase"
  }

  scopes {
    name = mongodbatlas_cluster.atlas_cluster.name
    type = "CLUSTER"
  }
}

resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

# AWS S3 Bucket (Public Access for Website Images)
resource "aws_s3_bucket" "app_bucket" {
  bucket = "ekwedding-bucket"  # Change to a unique name
  tags   = {
    Name        = "ekwedding App Bucket"
    Environment = "Production"
  }

}

# # AWS S3 Bucket ACL to allow public read access
# resource "aws_s3_bucket_acl" "app_bucket_acl" {
#   bucket = aws_s3_bucket.app_bucket.id
#   acl    = "public-read"  # Allow public read access for objects in the bucket
# }

# AWS S3 Bucket Versioning configuration
resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.app_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# AWS S3 Bucket Policy to Allow Public Read Access for Objects
# resource "aws_s3_bucket_policy" "bucket_policy" {
#   bucket = aws_s3_bucket.app_bucket.bucket

#   policy = jsonencode({
#     Version   = "2012-10-17"
#     Statement = [
#       {
#         Sid       = "PublicReadGetObject"
#         Effect    = "Allow"
#         Principal = "*"
#         Action    = "s3:GetObject"
#         Resource  = "arn:aws:s3:::${aws_s3_bucket.app_bucket.bucket}/*"  # Allow public access to all objects
#       },
#     ]
#   })
# }

# Use aws_s3_object instead of aws_s3_bucket_object for the policy file
resource "aws_s3_object" "public_objects_policy" {
  bucket = aws_s3_bucket.app_bucket.bucket
  key    = "public-read-policy.json"
  acl    = "private"  # This ensures the policy object itself is not publicly readable

  content = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${aws_s3_bucket.app_bucket.bucket}/*"  # Allow public access to all objects
      },
    ]
  })
}

# AWS ECR Repository
resource "aws_ecr_repository" "ekwedding_repo" {
  name = "ekwedding-app-repo"

  image_tag_mutability = "MUTABLE"
  tags = {
    Name        = "ekwedding ECR Repo"
    Environment = "Production"
  }
}

# AWS ECS Cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "ekwedding-ecs-cluster"
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "ekwedding_task" {
  family                   = "ekwedding-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "ekwedding-app"
      image = "${aws_ecr_repository.ekwedding_repo.repository_url}:latest"
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "MONGO_URI"
          value = mongodbatlas_cluster.atlas_cluster.connection_strings[0].standard_srv
        },
        {
          name  = "S3_BUCKET"
          value = aws_s3_bucket.app_bucket.bucket
        }
      ]
    }
  ])
}




# VPC and Subnet (New Resource for `vpc_id`)
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "my_subnet" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

# Security Group for ECS
resource "aws_security_group" "ecs_security_group" {
  name_prefix = "ecs-security-group"
  vpc_id      = aws_vpc.my_vpc.id
  ingress {
    from_port   = 3000
    to_port     = 3000
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

# ECS Service
resource "aws_ecs_service" "ecs_service" {
  name            = "ekwedding-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ekwedding_task.arn
  desired_count   = 1

  launch_type = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.my_subnet[*].id
    security_groups = [aws_security_group.ecs_security_group.id]
  }
}
