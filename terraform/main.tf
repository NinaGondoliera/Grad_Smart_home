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

data "aws_iam_policy_document" "update_db" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:UpdateItem"
    ]
    resources = [
      aws_dynamodb_table.devices.arn
    ]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.iam_for_lambda.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "lambda:InvokeFunction", 
          "events:PutEvents" 
        ]
        Effect   = "Allow"
        Resource = aws_lambda_function.motion_lambda.arn 
      },
    ]
  })
}


resource "aws_iam_policy" "update_db" {
  name        = "db-policy"
  description = "Allow to update items in DynamoDB"
  policy      = data.aws_iam_policy_document.update_db.json
}

resource "aws_iam_role_policy_attachment" "update_db_policy" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.update_db.arn
}


resource "aws_lambda_function" "motion_lambda" {
  filename      = "../lambda.zip"
  function_name = "lambda_to_trigger_light"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler" 
  runtime = "nodejs16.x"
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name = "/aws/lambda/${aws_lambda_function.motion_lambda.function_name}"
  retention_in_days = 5
}

resource "aws_lambda_permission" "allow_event_invocation" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.motion_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.motion_triggered.arn
}



