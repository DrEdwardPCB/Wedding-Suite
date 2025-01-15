locals {

  ecr_repo_name = "ekwedding-app-repo"

  demo_app_cluster_name        = "ekwedding-ecs-cluster"
  availability_zones           = ["us-east-1a", "us-east-1b", "us-east-1c"]
  demo_app_task_famliy         = "ekwedding-task"
  container_port               = 3000
  demo_app_task_name           = "ekwedding-task"
  ecs_task_execution_role_name = "ekwedding-task-execution-role"

  application_load_balancer_name = "ekwedding-app-alb"
  target_group_name              = "ekwedding-alb-tg"

  demo_app_service_name = "ekwedding-service"
}