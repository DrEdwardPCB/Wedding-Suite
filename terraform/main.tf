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

variable "MONGO_URI" {}
variable "COOKIE_SECRET_KEY" {}
variable "NEXT_PUBLIC_PW_ENCRYPTION_KEY" {}
variable "NEXT_PUBLIC_PW_ENCRYPTION_IV" {}
variable "MGMT_USERNAME" {}
variable "MGMT_PASSWORD" {}
variable "AWS_REGION" {}
variable "AMPLIFY_BUCKET" {}
variable "AWS_ACCESS_KEY_ID" {}
variable "AWS_SECRET_ACCESS_KEY" {}
variable "certificate_arn" {
  description = "The ARN of the SSL/TLS certificate in ACM"
  type        = string
}
variable "GOOGLE_CLIENT_ID"{}
variable "GOOGLE_CLIENT_SECRET"{}
variable "BASE_URL"{}

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

module "ecrRepo" {
  source = "./modules/ecr"

  ecr_repo_name = local.ecr_repo_name
}

module "ecsCluster" {
  source = "./modules/ecs"

  demo_app_cluster_name = local.demo_app_cluster_name
  availability_zones    = local.availability_zones

  demo_app_task_famliy         = local.demo_app_task_famliy
  ecr_repo_url                 = module.ecrRepo.repository_url
  container_port               = local.container_port
  demo_app_task_name           = local.demo_app_task_name
  ecs_task_execution_role_name = local.ecs_task_execution_role_name

  application_load_balancer_name = local.application_load_balancer_name
  target_group_name              = local.target_group_name
  demo_app_service_name          = local.demo_app_service_name
  certificate_arn = var.certificate_arn

  MONGO_URI= var.MONGO_URI
  COOKIE_SECRET_KEY= var.COOKIE_SECRET_KEY
  NEXT_PUBLIC_PW_ENCRYPTION_KEY= var.NEXT_PUBLIC_PW_ENCRYPTION_KEY
  NEXT_PUBLIC_PW_ENCRYPTION_IV= var.NEXT_PUBLIC_PW_ENCRYPTION_IV
  MGMT_USERNAME= var.MGMT_USERNAME
  MGMT_PASSWORD= var.MGMT_PASSWORD
  AWS_REGION= var.AWS_REGION
  AMPLIFY_BUCKET= var.AMPLIFY_BUCKET
  AWS_ACCESS_KEY_ID= var.AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY= var.AWS_SECRET_ACCESS_KEY
  GOOGLE_CLIENT_ID=var.GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET=var.GOOGLE_CLIENT_SECRET
  BASE_URL=var.BASE_URL
}