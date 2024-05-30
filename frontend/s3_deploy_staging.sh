#!/bin/zsh

BUCKET_NAME=staging.futbal-spoluhrac.sk
DIST_DIR=dist/frontend/browser

# 1. Build angular application
ng build --configuration staging --aot --optimization

# 2. Add robots.txt to dist
cp ./src/robots.txt $DIST_DIR 

# 3. Compress text resources
gzip -k $DIST_DIR/**/*.css
brotli $DIST_DIR/**/*.css

gzip -k $DIST_DIR/**/*.js
brotli $DIST_DIR/**/*.js

gzip -k $DIST_DIR/**/*.html
brotli $DIST_DIR/**/*.html

# 4. Upload all resources
aws s3 sync $DIST_DIR s3://$BUCKET_NAME --delete

# 5. Set up content-encoding http headers for compressed text resources
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ --recursive --exclude "*" --include "*.html.gz" --include "*.css.gz" --include "*.js.gz" --content-encoding gzip --metadata-directive REPLACE
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ --recursive --exclude "*" --include "*.html.br" --include "*.css.br" --include "*.js.br" --content-encoding br --metadata-directive REPLACE

# 6. Set up cache-control http headers for static assets
aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ --recursive --cache-control max-age=31536000 --metadata-directive REPLACE

# 7. Set up cache-control and content-encoding http headers for compressed static assets (there is no option to merge with existing headers)
aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ --recursive --exclude "*" --include "*.html.gz" --include "*.css.gz" --include "*.js.gz" --content-encoding gzip --cache-control max-age=31536000 --metadata-directive REPLACE
aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ --recursive --exclude "*" --include "*.html.br" --include "*.css.br" --include "*.js.br" --content-encoding br --cache-control max-age=31536000 --metadata-directive REPLACE

# 8. Invalidate CDN
echo "Going to invalidate/refresh current cloudfront distribution"

DISTRIBUTION_ID="EB01IXTCXX6TB"
PATHS="/*" # Paths to invalidate

INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "$PATHS" --query 'Invalidation.Id' --output text)
echo "Created invalidation with ID: $INVALIDATION_ID"

check_invalidation_status() {
  STATUS=$(aws cloudfront get-invalidation --distribution-id $DISTRIBUTION_ID --id $INVALIDATION_ID --query 'Invalidation.Status' --output text)
  echo "Invalidation status: $STATUS"
}

while true; do
  check_invalidation_status
  if [ "$STATUS" == "Completed" ]; then
    echo "Invalidation completed."
    break
  fi
  echo "Waiting for invalidation to complete..."
  sleep 10
done