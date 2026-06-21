#!/usr/bin/env bash
# Manual deploy script — builds the app and pushes it to S3, then invalidates CloudFront.
#
# Prerequisites:
#   - AWS CLI installed and configured (aws configure)
#   - Run scripts/setup-infra.sh once before the first deploy
#
# Usage:
#   chmod +x scripts/deploy.sh
#   S3_BUCKET_NAME=my-bucket CLOUDFRONT_DISTRIBUTION_ID=EXXXXX ./scripts/deploy.sh

set -euo pipefail

S3_BUCKET_NAME="${S3_BUCKET_NAME:?'Set S3_BUCKET_NAME env var'}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:?'Set CLOUDFRONT_DISTRIBUTION_ID env var'}"
DIST_DIR="dist/client/browser"

echo "==> Building production bundle"
npm run build

echo "==> Uploading index.html with no-cache headers"
aws s3 cp "$DIST_DIR/index.html" "s3://$S3_BUCKET_NAME/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

echo "==> Syncing hashed assets (cache-forever)"
aws s3 sync "$DIST_DIR/" "s3://$S3_BUCKET_NAME/" \
  --exclude "index.html" \
  --cache-control "max-age=31536000, immutable" \
  --delete

echo "==> Invalidating CloudFront cache for / and /index.html"
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/" "/index.html"

echo ""
echo "✅  Deploy complete!"
