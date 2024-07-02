# Lambdas

## Setting up Locally

1. Setup python
   ```sh
   pyenv local 3.12
   ```
2. Navigate to folder of labmda we want to set up
   ```sh
   cd add-player-need
   ```
3. Setup `venv`
   ```sh
   python -m venv venv
   ```
4. Activate `venv`
   ```sh
   source ./venv/bin/activate
   ```
5. Install dependencies
   ```sh
   pip install -r requirements.txt
   ```

Don't forget to freeze dependencies every time you add dependency. This is important, because `venv` is recreated 
every time deploy package is being build.
```sh
pip install requests
pip freeze > requirements.txt
```

## Running Locally

1. Setup local mysql instance using docker-compose
    ```sh
    cd ../db
    docker-compose up --detach
    cd ../lambdas
    ```
    That will start database and initialize it with necessary tables and users. You can connect to localhost:3306 using following accounts

    - root/password
    - user/password
    - application/XXXXXXX - our lambdas are going to connect using this user

2. Run lambda by running `runLocally.sh` shell script parameterized by lambda name. For example:
    ```sh
    ./run_locally.sh add-player-need
    ./run_locally.sh add-team-need
    ./run_locally.sh deactivate-player-need
    ./run_locally.sh get-player-need
    ./run_locally.sh update-marketing-consent-for-player-need
    ```

## Deploying to AWS staging
Deploy lambda by running `lambda_deploy_staging.sh` shell script parameterized by lambda name. For example:
```sh
./lambda_deploy_staging.sh add-player-need
./lambda_deploy_staging.sh add-team-need
./lambda_deploy_staging.sh deactivate-player-need
./lambda_deploy_staging.sh get-player-need
./lambda_deploy_staging.sh update-marketing-consent-for-player-need
```

## FAQ
### ModuleNotFoundError: No module named 'pymysql'
Despite everything is set up normally, I'm getting this error when running locally or in aws (any dependency, not just pymysql):
```sh
./run_locally.sh add-team-need 
Going to execute ./add-team-need/local_runner.py
Traceback (most recent call last):
  File "/Users/jorsag/src/sport-connect/lambdas/./add-team-need/local_runner.py", line 1, in <module>
    import lambda_function
  File "/Users/jorsag/src/sport-connect/lambdas/add-team-need/lambda_function.py", line 3, in <module>
    import pymysql
ModuleNotFoundError: No module named 'pymysql'
```

This helps:
```sh
pip cache purge
```
