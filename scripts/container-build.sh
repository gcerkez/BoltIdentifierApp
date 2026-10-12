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

echo "Building container image using ${CONTAINER_CMD}: ${IMAGE_TAG}..."
${CONTAINER_CMD} build -t "${IMAGE_TAG}" -f Dockerfile .

echo "Build completed successfully: ${IMAGE_TAG}"
