#!/bin/bash
set -ueE -o pipefail

# If the tests succeeded, then deploy our release to [Surge](https://surge.sh) URLs for our branch, tag, and commit.
# Useful for rendering documentation and compiling code then deploying the release,
# such that you don't need the rendered documentation and compiled code inside your source repository.
# This is beneficial because sometimes documentation will reference the current commit,
# causing a documentation recompile to always leave a dirty state - this solution avoids that,
# as documentation can be git ignored.

# =====================================
# INSTALL

# jobs:
#   publish:
#     if: ${{ github.event_name == 'push' }}

# =====================================
# DEPENDENCIES

# SURGE
# You will need to make sure you have surge installed:
# npm install --save-dev surge

# =====================================
# AUTOMATIC GITHUB ENVIRONMENT VARIABLES
# https://docs.github.com/en/free-pro-team@latest/actions/reference/environment-variables

# GITHUB_REPOSITORY
# GITHUB_REF
# GITHUB_SHA

# =====================================
# MANUAL ENVIRONMENT VARIABLES

# env:
#
#   # Set your `SURGE_LOGIN` which is your surge.sh username
#   SURGE_LOGIN: ${{secrets.SURGE_LOGIN}}
#
#   # Set your `SURGE_TOKEN` (which you can get via the `surge token` command)
#   SURGE_TOKEN: ${{secrets.SURGE_TOKEN}}
#
#   # Set the path that you want to deploy to surge
#   SURGE_PROJECT: "."

# =====================================
# LOCAL ENVIRONMENT VARIABLES

REPO_TAG=""
REPO_BRANCH=""
REPO_COMMIT=""
if [[ "$GITHUB_REF" == "refs/tags/"* ]]; then
	REPO_TAG="${GITHUB_REF#"refs/tags/"}"
elif [[ "$GITHUB_REF" == "refs/heads/"* ]]; then
	REPO_BRANCH="${GITHUB_REF#"refs/heads/"}"
	REPO_COMMIT="$GITHUB_SHA"
else
	echo "unknown GITHUB_REF=$GITHUB_REF"
	exit 1
fi

# org/name => name.org
SURGE_SLUG="$(echo "$GITHUB_REPOSITORY" | sed 's/^\(.*\)\/\(.*\)/\2.\1/')"

# defaults
if test -z "${SURGE_PROJECT-}"; then
	SURGE_PROJECT="."
fi

# =====================================
# CHECKS

if [[ "$REPO_BRANCH" = *"dependabot"* ]]; then
	echo "skipping as running on a dependabot branch"
	exit 0
elif test -z "${SURGE_LOGIN-}" -o -z "${SURGE_TOKEN-}"; then
	echo "you must provide a SURGE_LOGIN + SURGE_TOKEN combination"
	exit 1
fi

# =====================================
# RUN

targets=()

if test -n "$REPO_BRANCH"; then
	targets+=("$REPO_BRANCH.$SURGE_SLUG.surge.sh")
fi
if test -n "$REPO_TAG"; then
	targets+=("$REPO_TAG.$SURGE_SLUG.surge.sh")
fi
if test "$REPO_COMMIT"; then
	targets+=("$REPO_COMMIT.$SURGE_SLUG.surge.sh")
fi

if test ${#targets[@]} -eq 0; then
	echo 'failed to detect targets'
	exit 1
else
	for target in ${targets[*]}; do
		echo "deploying $SURGE_PROJECT to $target"
		npx --no-install surge --project $SURGE_PROJECT --domain "$target"
	done
fi
