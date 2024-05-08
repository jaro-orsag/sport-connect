# Lambdas

# Running Locally

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

2. Run lambda by running following shell script
    ```sh
    ./runLambdaLocally.sh
    ```

    This script will be later parameterized to be able to run several diffeerent lambdas.