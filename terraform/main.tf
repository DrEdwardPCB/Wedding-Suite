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
# Additional Policy for ECR Access
resource "aws_iam_policy" "ecr_access_policy" {
  name        = "ECRAccessPolicy"
  description = "Policy for ECS tasks to access ECR"
  
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ],
        Resource = "arn:aws:ecr:us-east-1:458044237546:repository/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_ecr_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecr_access_policy.arn
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

resource "aws_subnet" "my_subnet_a" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "my_subnet_b" {
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true
}

# Internet Gateway
resource "aws_internet_gateway" "my_igw" {
  vpc_id = aws_vpc.my_vpc.id
}
# Route Table for Public Subnet
resource "aws_route_table" "public_route" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_igw.id
  }
}

# Association for Subnet A
resource "aws_route_table_association" "public_route_association_a" {
  subnet_id      = aws_subnet.my_subnet_a.id
  route_table_id = aws_route_table.public_route.id
}

# Association for Subnet B
resource "aws_route_table_association" "public_route_association_b" {
  subnet_id      = aws_subnet.my_subnet_b.id
  route_table_id = aws_route_table.public_route.id
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
    subnets         = [
      aws_subnet.my_subnet_a.id,
      aws_subnet.my_subnet_b.id
    ]
    security_groups = [aws_security_group.ecs_security_group.id]
  }
}

# application loadbalancer
resource "aws_lb" "application_lb" {
  name               = "my-application-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_security_group.id]
  subnets            = [
    aws_subnet.my_subnet_a.id,
    aws_subnet.my_subnet_b.id
  ]

  enable_deletion_protection = false
}

resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.application_lb.arn
  port              = 443
  protocol          = "HTTPS"

  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:458044237546:certificate/4eff10d0-9dd5-4eb2-bed0-5c2b73faca0f"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.my_target_group.arn
  }
}

resource "aws_lb_target_group" "my_target_group" {
  name     = "my-target-group"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.my_vpc.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold  = 2
    unhealthy_threshold = 2
  }
}
