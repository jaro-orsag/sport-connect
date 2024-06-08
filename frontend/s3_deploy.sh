#!/bin/zsh

ANGULAR_ENVIRONMENT=$1
BUCKET_NAME=$2
CLOUDFRONT_DISTRIBUTION_ID=$3
GOOGLE_SEARCH_CONSOLE_VERIFICATION_FILE=$4

echo "Angular Environment..................... $ANGULAR_ENVIRONMENT"
echo "Bucket Name............................. $BUCKET_NAME"
echo "Cloudfront Distribution ID.............. $CLOUDFRONT_DISTRIBUTION_ID"
echo "Google Search Console Verification File. $GOOGLE_SEARCH_CONSOLE_VERIFICATION_FILE"
echo
echo

if [ -z "$BUCKET_NAME" ]; then
    echo "Bucket name must be provided"
    exit 1
fi

DIST_DIR=dist/frontend/browser

# 1. Build angular application
ng build --configuration $ANGULAR_ENVIRONMENT --aot --optimization

# 2. Add robots.txt and google search console verification file to dist
cp ./src/robots.txt $DIST_DIR 

if [ -n "$GOOGLE_SEARCH_CONSOLE_VERIFICATION_FILE" ]; then
    cp ./src/$GOOGLE_SEARCH_CONSOLE_VERIFICATION_FILE $DIST_DIR 
else 
    echo
    echo "Google search console verification file not found. Not going to copy it."
    echo
fi

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

# 8. Set correct content type for website thunbnail (TODO: this should be done in more systematic way for all image resources)
aws s3 cp s3://$BUCKET_NAME/assets/thumbnail.png s3://$BUCKET_NAME/assets/thumbnail.png --content-type image/png --metadata-directive REPLACE

# 9. Invalidate CDN
echo "Going to invalidate/refresh current cloudfront distribution"

PATHS="/*" # Paths to invalidate

if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo
    echo "Cloudfront distribution ID not provided. Not going to invalidate it."
    exit 0
fi

INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "$PATHS" --query 'Invalidation.Id' --output text)
echo "Created invalidation with ID: $INVALIDATION_ID"

check_invalidation_status() {
  STATUS=$(aws cloudfront get-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --id $INVALIDATION_ID --query 'Invalidation.Status' --output text)
  echo "Invalidation status: $STATUS"
}

while true; do
  check_invalidation_status
  if [ "$STATUS" = "Completed" ]; then
    echo "Invalidation completed."
    break
  fi
  echo "Waiting for invalidation to complete..."
  sleep 10
done