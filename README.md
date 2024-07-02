# sport-connect

This repo implements an online service that connects two types of actors
- Footbal teams looking for substitutes when one of their buddies can not attend the game
- Footbal players that want to play football, but do not have a team 

URLs:
- Production: https://www.futbal-spoluhrac.sk
- Staging: https://staging.futbal-spoluhrac.sk

The repo consists of 3 folders.

## db
Contains script for database initialisation. For now, we have no database migration solution in place. When db 
structure update is necessary, just save the update script at the end of the [./db/ddl.sql](./db/ddl.sql) file 
and run this increment using `DBeaver` or similar tool. 

The same DDL script is used when running lambdas locally. In this case, also 
[./db/docker-compose.yml](./db/docker-compose.yml) is used to spin up the container with the database.

## frontend
Standard angular application. Can be run/build in a standard way documented in angular-generated 
[./frontend/README.md](./frontend/README.md).

There are two scripts that deploy the application (angular frontend only) to staging or prod:
* [./frontend/s3_deploy_prod.sh](./frontend/s3_deploy_prod.sh)
* [./frontend/s3_deploy_staging.sh](./frontend/s3_deploy_staging.sh)

Each of them perform following tasks:
* Build the angular application
* Compress text resources
* Upload all resources to S3
* Set up compression of text resources on S3
* Set up caching for static assets on S3
* Invalidate/refresh cloudfcont distribution

## lambdas
Python lambdas. See [./lambdas/README.MD](./lambdas/README.MD) for more info on how to run them locally and 
how to deploy them to aws.