#!/bin/zsh

ANGULAR_ENVIRONMENT=staging
BUCKET_NAME=staging.futbal-spoluhrac.sk
CLOUDFRONT_DISTRIBUTION_ID="EB01IXTCXX6TB"
GOOGLE_SEARCH_CONSOLE_VERIFICATION_FILE=google3b9bed403026ef96.html

./s3_deploy.sh $ANGULAR_ENVIRONMENT $BUCKET_NAME $CLOUDFRONT_DISTRIBUTION_ID $GOOGLE_SEARCH_CONSOLE_VERIFICATION_FILE