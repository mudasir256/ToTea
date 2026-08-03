#!/usr/bin/env bash
# Deploy Square create-checkout to the project that hosts menu_items.
# Requires Supabase CLI login with access to project ypxjfnizqvishmgijjzg.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROJECT_REF="${SUPABASE_PROJECT_REF:-ypxjfnizqvishmgijjzg}"

if [[ ! -f .env ]]; then
  echo "Missing .env"
  exit 1
fi

# shellcheck disable=SC1091
set -a
# Load only the keys we need (do not print values)
eval "$(grep -E '^(SQUARE_ACCESS_TOKEN|VITE_SQUARE_LOCATION_ID|VITE_SQUARE_ENVIRONMENT)=' .env)"
set +a

if [[ -z "${SQUARE_ACCESS_TOKEN:-}" || -z "${VITE_SQUARE_LOCATION_ID:-}" ]]; then
  echo "SQUARE_ACCESS_TOKEN and VITE_SQUARE_LOCATION_ID must be set in .env"
  exit 1
fi

ENV="${VITE_SQUARE_ENVIRONMENT:-sandbox}"

echo "Deploying create-checkout → ${PROJECT_REF}"
npx supabase functions deploy create-checkout --project-ref "$PROJECT_REF"

echo "Setting Square secrets on ${PROJECT_REF}"
npx supabase secrets set \
  "SQUARE_ACCESS_TOKEN=${SQUARE_ACCESS_TOKEN}" \
  "SQUARE_LOCATION_ID=${VITE_SQUARE_LOCATION_ID}" \
  "SQUARE_ENVIRONMENT=${ENV}" \
  "ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080" \
  --project-ref "$PROJECT_REF"

echo "Done. Restart the Vite dev server, sign in, and pay on /checkout."
