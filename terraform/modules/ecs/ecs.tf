resource "aws_ecs_cluster" "demo_app_cluster" {
  name = var.demo_app_cluster_name
}

resource "aws_default_vpc" "default_vpc" {}

resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = var.availability_zones[0]
}

resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = var.availability_zones[1]
}

resource "aws_default_subnet" "default_subnet_c" {
  availability_zone = var.availability_zones[2]
}
resource "aws_cloudwatch_log_group" "demo_app" {
  name              = "/ecs/${var.demo_app_task_name}"
  retention_in_days = 30
}

resource "aws_ecs_task_definition" "demo_app_task" {
  family                   = var.demo_app_task_famliy
  container_definitions    = jsonencode([
    {
      name      = var.demo_app_task_name
      image     = "${var.ecr_repo_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
        }
      ]
      memory       = 1024
      cpu          = 512
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.demo_app_task_name}"
          "awslogs-region"        = var.AWS_REGION
          "awslogs-stream-prefix" = "ecs"
        }
      }
      environment = [
        {
          name  = "MONGO_URI"
          value = var.MONGO_URI
        },
        {s
          name  = "COOKIE_SECRET_KEY"
          value = var.COOKIE_SECRET_KEY
        },
        {
          name  = "NEXT_PUBLIC_PW_ENCRYPTION_KEY"
          value = var.NEXT_PUBLIC_PW_ENCRYPTION_KEY
        },
        {
          name  = "NEXT_PUBLIC_PW_ENCRYPTION_IV"
          value = var.NEXT_PUBLIC_PW_ENCRYPTION_IV
        },
        {
          name  = "MGMT_USERNAME"
          value = var.MGMT_USERNAME
        },
        {
          name  = "MGMT_PASSWORD"
          value = var.MGMT_PASSWORD
        },
        {
          name  = "AWS_REGION"
          value = var.AWS_REGION
        },
        {
          name  = "AMPLIFY_BUCKET"
          value = var.AMPLIFY_BUCKET
        },
        {
          name  = "AWS_ACCESS_KEY_ID"
          value = var.AWS_ACCESS_KEY_ID
        },
        {
          name  = "AWS_SECRET_ACCESS_KEY"
          value = var.AWS_SECRET_ACCESS_KEY
        },
        {
          name  = "GOOGLE_CLIENT_ID"
          value = var.GOOGLE_CLIENT_ID
        },
        {
          name  = "GOOGLE_CLIENT_SECRET"
          value = var.GOOGLE_CLIENT_SECRET
        },
        {
          name  = "BASE_URL"
          value = var.BASE_URL
        },
        {
            name="HOSTNAME"
            value="0.0.0.0"
        }
      ]
    }
  ])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 1024
  cpu                      = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = var.ecs_task_execution_role_name
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_alb" "application_load_balancer" {
  name               = var.application_load_balancer_name
  load_balancer_type = "application"
  subnets = [
    "${aws_default_subnet.default_subnet_a.id}",
    "${aws_default_subnet.default_subnet_b.id}",
    "${aws_default_subnet.default_subnet_c.id}"
  ]
  security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
}

resource "aws_security_group" "load_balancer_security_group" {
  ingress = [
    {
        description = "permit http"
        from_port   = 80
        to_port     = 80
        ipv6_cidr_blocks = []
        prefix_list_ids  = []
        protocol    = "tcp"
        security_groups  = []
        self             = false
        cidr_blocks = ["0.0.0.0/0"]
    },
    {
        description = "permit https"
        from_port   = 443
        to_port     = 443
        ipv6_cidr_blocks = []
        prefix_list_ids  = []
        protocol    = "tcp"
        security_groups  = []
        self             = false
        cidr_blocks = ["0.0.0.0/0"]
    }
  ]

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "target_group" {
  name        = var.target_group_name
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_default_vpc.default_vpc.id
  health_check {
    path                = "/api/health"         # Health check endpoint exposed by ECS tasks
    interval            = 60                # Time between health checks (in seconds)
    timeout             = 30                 # Timeout for each health check
    healthy_threshold   = 2                 # Healthy response threshold
    unhealthy_threshold = 2                 # Unhealthy response threshold
    matcher             = "200"             # Expected HTTP status code
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_alb.application_load_balancer.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}
resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_alb.application_load_balancer.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08" # Modify as per your security requirements
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

resource "aws_ecs_service" "demo_app_service" {
  name            = var.demo_app_service_name
  cluster         = aws_ecs_cluster.demo_app_cluster.id
  task_definition = aws_ecs_task_definition.demo_app_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1
  deployment_maximum_percent         = 100 
  deployment_minimum_healthy_percent = 0

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn
    container_name   = aws_ecs_task_definition.demo_app_task.family
    container_port   = var.container_port
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}", "${aws_default_subnet.default_subnet_c.id}"]
    assign_public_ip = true
    security_groups  = ["${aws_security_group.service_security_group.id}"]
  }
}

resource "aws_security_group" "service_security_group" {
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = ["${aws_security_group.load_balancer_security_group.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}