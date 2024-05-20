ng build --configuration staging
aws s3 sync dist/frontend/browser s3://staging.futbal-spoluhrac.sk --delete