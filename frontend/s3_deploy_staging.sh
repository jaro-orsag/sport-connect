ng build --configuration staging --aot --optimization
aws s3 sync dist/frontend/browser s3://staging.futbal-spoluhrac.sk --delete

# Replace these with your actual values
DISTRIBUTION_ID="EB01IXTCXX6TB"
PATHS="/*" # Paths to invalidate

# Create invalidation and capture the invalidation ID
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "$PATHS" --query 'Invalidation.Id' --output text)

echo "Created invalidation with ID: $INVALIDATION_ID"

# Function to check the status of the invalidation
check_invalidation_status() {
  STATUS=$(aws cloudfront get-invalidation --distribution-id $DISTRIBUTION_ID --id $INVALIDATION_ID --query 'Invalidation.Status' --output text)
  echo "Invalidation status: $STATUS"
}

# Check status until it becomes "Completed"
while true; do
  check_invalidation_status
  if [ "$STATUS" == "Completed" ]; then
    echo "Invalidation completed."
    break
  fi
  echo "Waiting for invalidation to complete..."
  sleep 10 # Wait for 10 seconds before checking again
done