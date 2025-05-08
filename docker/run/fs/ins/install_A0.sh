#!/bin/bash

# branch from parameter
if [ -z "$1" ]; then
    echo "Error: Branch parameter is empty. Please provide a valid branch name."
    exit 1
fi
BRANCH="$1"

# Use REPO_URL environment variable or default to original URL
REPO_URL="${REPO_URL:-https://github.com/frdel/agent-zero}"

# Extract repository name from URL (everything after the last slash)
REPO_NAME=$(basename "$REPO_URL")

# clone project repo branch
git clone -b "$BRANCH" "$REPO_URL" "/git/$REPO_NAME"

# setup python environment
. "/ins/setup_venv.sh" "$@"

# Ensure the virtual environment and pip setup
pip install --upgrade pip ipython requests

# Install some packages in specific variants
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Install remaining A0 python packages
pip install -r /git/$REPO_NAME/requirements.txt

# Preload A0
python /git/$REPO_NAME/preload.py --dockerized=true