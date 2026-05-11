#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e
# Treat unset variables as an error when substituting.
set -u
# Pipelines fail if any command fails, not just the last one.
set -o pipefail

# --- Pre-deployment Checks ---
echo ">>> Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "Error: Git command not found."
    exit 1
fi
echo "Git found."

echo ">>> Checking Git status..."
if ! git diff --quiet HEAD --; then
    echo "Error: Uncommitted changes in your working directory."
    echo "Please commit or stash your changes before deploying."
    exit 1
fi
echo "Git working directory is clean."

echo ">>> Running validation checks..."
if ! npm run validate; then
    echo "Error: Validation failed. Please fix the issues before deploying."
    exit 1
fi
echo "Validation checks passed successfully."

# --- Deployment ---
echo ">>> Starting deployment to GitHub Pages..."

if git push origin main; then
    echo ">>> Deployment to GitHub Pages initiated successfully."
    echo ">>> Your site will be available at https://entmoot.github.io/entmoot.io/ shortly."
else
    echo "Error: Push to GitHub failed. Check the output above for details."
    exit 1
fi

# --- Completion ---
echo ">>> Deployment script finished successfully."
exit 0