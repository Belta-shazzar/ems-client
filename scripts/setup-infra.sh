#!/usr/bin/env bash
# One-time script to create the S3 bucket and CloudFront distribution.
# Run this locally once before your first deploy.
#
# Prerequisites:
#   - AWS CLI installed and configured (aws configure)
#   - jq installed (brew install jq)
#
# Usage:
#   chmod +x scripts/setup-infra.sh
#   ./scripts/setup-infra.sh

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────
# Edit these values before running.
BUCKET_NAME="ems-client"   # Must be globally unique
AWS_REGION="eu-west-1"                            # Change to your preferred region
# ─────────────────────────────────────────────────────────────────────────────

echo "==> Creating S3 bucket: $BUCKET_NAME in $AWS_REGION"

if [ "$AWS_REGION" = "us-east-1" ]; then
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$AWS_REGION"
else
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --create-bucket-configuration LocationConstraint="$AWS_REGION"
fi

echo "==> Blocking all public access on bucket (CloudFront OAC will access it privately)"
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "==> Creating CloudFront Origin Access Control (OAC)"
OAC_CONFIG='{
  "Name": "'"$BUCKET_NAME"'-oac",
  "Description": "OAC for '"$BUCKET_NAME"'",
  "SigningProtocol": "sigv4",
  "SigningBehavior": "always",
  "OriginAccessControlOriginType": "s3"
}'

OAC_ID=$(aws cloudfront create-origin-access-control \
  --origin-access-control-config "$OAC_CONFIG" \
  --query "OriginAccessControl.Id" \
  --output text)

echo "    OAC ID: $OAC_ID"

echo "==> Creating CloudFront distribution"
DISTRIBUTION_CONFIG='{
  "CallerReference": "'"$BUCKET_NAME-$(date +%s)"'",
  "Comment": "'"$BUCKET_NAME"' SPA",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3Origin",
      "DomainName": "'"$BUCKET_NAME"'.s3.'"$AWS_REGION"'.amazonaws.com",
      "S3OriginConfig": { "OriginAccessIdentity": "" },
      "OriginAccessControlId": "'"$OAC_ID"'"
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true,
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    }
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 0
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 0
      }
    ]
  },
  "Enabled": true,
  "HttpVersion": "http2and3",
  "PriceClass": "PriceClass_100"
}'

DISTRIBUTION=$(aws cloudfront create-distribution \
  --distribution-config "$DISTRIBUTION_CONFIG")

DISTRIBUTION_ID=$(echo "$DISTRIBUTION" | jq -r '.Distribution.Id')
DISTRIBUTION_DOMAIN=$(echo "$DISTRIBUTION" | jq -r '.Distribution.DomainName')

echo "    Distribution ID:     $DISTRIBUTION_ID"
echo "    Distribution Domain: $DISTRIBUTION_DOMAIN"

echo "==> Attaching bucket policy so CloudFront OAC can read from S3"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

BUCKET_POLICY='{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontOAC",
    "Effect": "Allow",
    "Principal": {
      "Service": "cloudfront.amazonaws.com"
    },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::'"$BUCKET_NAME"'/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::'"$ACCOUNT_ID"':distribution/'"$DISTRIBUTION_ID"'"
      }
    }
  }]
}'

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy "$BUCKET_POLICY"

echo ""
echo "✅  Infrastructure created successfully!"
echo ""
echo "──────────────────────────────────────────"
echo "  S3 Bucket:              $BUCKET_NAME"
echo "  CloudFront ID:          $DISTRIBUTION_ID"
echo "  CloudFront Domain:      https://$DISTRIBUTION_DOMAIN"
echo "──────────────────────────────────────────"
echo ""
echo "Add the following secrets to your GitHub repository:"
echo "  S3_BUCKET_NAME              = $BUCKET_NAME"
echo "  CLOUDFRONT_DISTRIBUTION_ID  = $DISTRIBUTION_ID"
echo "  AWS_ACCESS_KEY_ID           = <your IAM key>"
echo "  AWS_SECRET_ACCESS_KEY       = <your IAM secret>"
echo ""
echo "Note: CloudFront may take 5–15 minutes to fully deploy."
