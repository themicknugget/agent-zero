#!/bin/bash

# Extract repository name from URL (everything after the last slash)
REPO_NAME=$(basename "${REPO_URL:-https://github.com/frdel/agent-zero}")
SOURCE_DIR="/git/$REPO_NAME"
DEST_DIR="/a0"

# Create destination directory if it doesn't exist
mkdir -p $DEST_DIR

# Copy the contents of the source directory to the destination directory
cp -r $SOURCE_DIR/* $DEST_DIR/

echo "Copy completed successfully."