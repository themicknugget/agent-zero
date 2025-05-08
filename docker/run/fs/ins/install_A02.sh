#!/bin/bash

# Extract repository name from URL (everything after the last slash)
REPO_NAME=$(basename "${REPO_URL:-https://github.com/frdel/agent-zero}")

# Clean up repository
rm -rf /git/$REPO_NAME

# Clone the repository again for fresh installation
git clone -b "${1:-development}" "$REPO_URL" "/git/$REPO_NAME"

# Run preload script
python /git/$REPO_NAME/preload.py --dockerized=true

# cachebuster script, this helps speed up docker builds
rm -rf /git/agent-zero

# run the original install script again
bash /ins/install_A0.sh "$@"

# remove python packages cache
. "/ins/setup_venv.sh" "$@"
pip cache purge