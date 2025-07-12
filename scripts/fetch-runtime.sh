#!/usr/bin/env bash
set -euo pipefail

FILE="resources/runtime-x86_64"
if [ -f "$FILE" ]; then
  echo "Runtime already downloaded: $FILE"
  exit 0
fi

mkdir -p resources
curl -L --fail https://github.com/AppImage/AppImageKit/releases/download/continuous/runtime-x86_64 -o "$FILE"
chmod +x "$FILE"

echo "Downloaded runtime to $FILE"
