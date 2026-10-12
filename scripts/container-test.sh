#!/usr/bin/env bash
set -euo pipefail

# Detect container runtime (podman or docker)
if command -v podman >/dev/null 2>&1; then
  CONTAINER_CMD="podman"
elif command -v docker >/dev/null 2>&1; then
  CONTAINER_CMD="docker"
else
  echo "Error: Neither podman nor docker was found in PATH." >&2
  exit 1
fi

IMAGE_TAG="${IMAGE_TAG:-bolt-identifier-app:latest}"

# Build image if it doesn't exist
if ! ${CONTAINER_CMD} image exists "${IMAGE_TAG}" 2>/dev/null && ! ${CONTAINER_CMD} inspect "${IMAGE_TAG}" >/dev/null 2>&1; then
  echo "Image ${IMAGE_TAG} not found. Building first..."
  ${CONTAINER_CMD} build -t "${IMAGE_TAG}" -f Dockerfile .
fi

# Run test suite or custom command inside container
echo "Running test suite inside container (${CONTAINER_CMD})..."
if [ "$#" -gt 0 ]; then
  ${CONTAINER_CMD} run --rm "${IMAGE_TAG}" "$@"
else
  ${CONTAINER_CMD} run --rm "${IMAGE_TAG}" sh -c "npm test && npm run typecheck && npm run lint"
fi

echo "All containerized checks passed successfully!"
