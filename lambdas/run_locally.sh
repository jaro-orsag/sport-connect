export USER_NAME=application
export PASSWORD=XXXXXXX
export HOST=localhost
export DB_NAME=StagingFootballBuddy

PYTHON_SCRIPT_TO_EXECUTE="./$1/local_runner.py"
echo Going to execute $PYTHON_SCRIPT_TO_EXECUTE

python $PYTHON_SCRIPT_TO_EXECUTE