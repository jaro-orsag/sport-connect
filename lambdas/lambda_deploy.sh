ENVIRONMENT=$2

if [ -z "$ENVIRONMENT" ]; then
  
  echo "environment parameter was not provided"
  exit 1
fi

LAMBDA_NAME=$1
echo Going to build deployment package for lambda $LAMBDA_NAME.

TIMESTAMP=$(date +"%Y-%m-%d-%H-%M-%S")
PACKAGE_NAME=$LAMBDA_NAME"_deployment_package_"$TIMESTAMP".zip"

cd $LAMBDA_NAME
mkdir -p dist
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
deactivate
cd venv/lib/python3.12/site-packages
echo "Creating zip package..."
zip -rq "../../../../"$PACKAGE_NAME .
cd ../../../../
zip $PACKAGE_NAME lambda_function.py
mv $PACKAGE_NAME dist
source ./venv/bin/activate

echo
echo Going to deploy package $PACKAGE_NAME
aws lambda update-function-code --function-name $ENVIRONMENT-$LAMBDA_NAME --zip-file fileb://./dist/$PACKAGE_NAME | cat