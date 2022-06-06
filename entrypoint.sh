#!/usr/bin/env bash
set -Ex

function apply_path {

    echo "Check that we have ENVIROMENT_VAR vars"
    test -n "$ENVIROMENT_VAR"

    find /usr/src/app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_ENVIROMENT_VAR#$ENVIROMENT_VAR#g"
}

apply_path
echo "Starting Nextjs"
exec "$@"