provider "aws" {
  region = "eu-west-2"  
}

variable "region" {
  description = "AWS region"
  default     = "eu-west-2"
}


resource "aws_dynamodb_table" "devices" {
  name             = "Devices"
  billing_mode     = "PROVISIONED"
  read_capacity    = 5
  write_capacity   = 5
  hash_key         = "name"

  attribute {
    name = "name"
    type = "S"
  }

}

resource "aws_cloudwatch_event_bus" "smart_events" {
  name = "smart_events"
}

resource "aws_cloudwatch_event_rule" "motion_triggered" {
  name                = "motion_triggered"
  event_pattern       = jsonencode({
    source      = ["smart_home_server"],
    detail-type = ["motionTriggered"],
    detail = {
      name     = ["Motion Tracker"],
      state       = ["Triggered"],
    }
  })
  event_bus_name = aws_cloudwatch_event_bus.smart_events.name
}

resource "aws_cloudwatch_event_target" "lambda" {
  rule = aws_cloudwatch_event_rule.motion_triggered.name
  arn = aws_lambda_function.motion_lambda.arn
  event_bus_name = aws_cloudwatch_event_bus.smart_events.name
}


data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_lambda_function" "motion_lambda" {
  filename      = "../lambda.zip"
  function_name = "lambda_to_trigger_light"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler" 
  runtime = "nodejs20.x"
}


