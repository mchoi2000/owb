#!/usr/bin/env bash

#   This script is for blue-green deployment to Cloud Foundry.

#   CF_DOMAIN               default to mybluemix.net
#   CF_ID                   The Cloud Foundry ID to authenticate with.
#   CF_PWD                  The Cloud Foundry password to authenticate with.
#   CF_TARGET               the bluemix region. default to https://api.ng.bluemix.net
#   CF_ORG?                 The Cloud Foundry organization to deploy into.
#   CF_SPACE?               The Cloud Foundry space to deploy into.
#   APP_NAME                The application name.
#   APP_PATH                The application path on disk.
#   APP_MANIFEST_PATH       The application manifest file path
#   CF_ENV_PREFIX?          The prefix of exported environment variables for Cloud Foundry application.
#   CF_SERVICE_PREFIX?      The prefix of bind service names for Cloud Foundry application.
#   CF_NODE_ENV             The Node environment to run on Cloud Foundry (development, test, production, etc.)
#   PROJ_PATH               The project path on disk.

## Limitation

# * the manifest file should not contain services nor environment variables section

# Running the deployment locally; Set proper env variables
if [ -f "./server/config/local.env.json" ]; then
  JSON=()
  while read line; do
    JSON+=("$line")
  done < <(cat ./server/config/local.env.json | ./node_modules/.bin/JSON.sh -b | tr -d '"[]' | tr "\t" " ")
  for value in "${JSON[@]}"; do
     read -r VAR VAL <<< $value
     export $VAR="$VAL"
  done

  CF_ORG="MarketplaceOnboarding"
  CF_SPACE="workbench-dev"
  APP_PATH="./dist"
  APP_MANIFEST_PATH="./dist"
  PROJ_PATH="./"

  if [ -z "${APP_NAME}" ]; then
    APP_NAME="devtestworkbench"
  fi

  if [ -z "${CF_ENV_PREFIX}" ]; then
    CF_ENV_PREFIX="CFCI"
  fi

  if [ -z "${CF_SERVICE_PREFIX}" ]; then
    CF_SERVICE_PREFIX="CFSVC"
  fi

  if [ -z "${CF_NODE_ENV}" ]; then
    CF_NODE_ENV="development"
  fi
fi

REQUIRED=("CF_ID" "CF_PWD" "APP_NAME")
for name in ${REQUIRED[*]}; do
    if [ -z "${!name}" ]; then
        echo "The '${name}' environment variable is required."
        exit 1
    fi
done

APP_DEPLOY_VERSION=$(date +%s)
APP_DEPLOY_NAME="${APP_NAME}-${APP_DEPLOY_VERSION}"
if [ -z "${APP_PATH}" ]; then
    APP_PATH=$(pwd)
fi

if [ -z "${PROJ_PATH}" ]; then
  PROJ_PATH="${APP_PATH}"
fi

# decide the application directory
[ -d $APP_PATH ] && APP_DIR="$APP_PATH" || APP_DIR=$(dirname "$APP_PATH")

CF_TARGET="${CF_TARGET:-https://api.w3ibm.bluemix.net}"
CF_DOMAIN="${CF_DOMAIN:-mybluemix.net}"
export APP_URL="https://${APP_DEPLOY_NAME}.${CF_DOMAIN}"

if [ -d $CF_NODE_ENV ]; then
  CF_NODE_ENV="production"
fi

install-cf-cli() {
    # install cf CLI
    if [ -z "$(which cf)" ]; then
        curl -sLO http://go-cli.s3-website-us-east-1.amazonaws.com/releases/v6.9.0/cf-linux-amd64.tgz
        [ -f /usr/bin/sudo ] && sudo tar -xzf cf-linux-amd64.tgz -C /usr/bin
        # TODO handle env without sudo
        rm -rf cf-linux-amd64.tgz
    else
        echo "found cf command, skipping install"
    fi
}

cf-login() {
    echo "Logging into $CF_TARGET"
    cf login -a "${CF_TARGET:-https://api.ng.bluemix.net}" -u $CF_ID -p "$CF_PWD" \
    -o ${CF_ORG:-$CF_ID} -s ${CF_SPACE:-dev}
}

push2cf() {
    pushd ${PROJ_PATH} > /dev/null

    local APP_VERSION=unknown
    local APP_MANIFEST

    if [ -d "${APP_MANIFEST_PATH}" ]; then
        APP_MANIFEST=${APP_MANIFEST_PATH}/manifest.yml
    elif [ -f "${APP_MANIFEST_PATH}" ]; then
        APP_MANIFEST=${APP_MANIFEST_PATH}
    else
        APP_MANIFEST=${APP_DIR}/manifest.yml
    fi

    GIT_REVISION=$(git rev-parse HEAD)
    if [ $? == 0 ]; then
        echo "Detected git revision ${GIT_REVISION}"
        APP_VERSION="${GIT_REVISION}"
    fi

    local RETURN_CODE=0

    echo "using manifest file: ${APP_MANIFEST}"

    # setup services
    if [ -n "${CF_SERVICE_PREFIX}" ]; then
        cat <<EOT >> ${APP_MANIFEST}
  services:
EOT
        for cf_service in $(compgen -e | grep "${CF_SERVICE_PREFIX}"); do
            cat <<EOT >> ${APP_MANIFEST}
    - ${!cf_service}
EOT
        done
    fi

    # setup env variables
    cat <<EOT >> ${APP_MANIFEST}
  env:
    APP_VERSION: ${APP_VERSION}
    NODE_ENV: ${CF_NODE_ENV}
EOT

    # enable new relic if requested
    if [ -n "${NEW_RELIC_ENABLED}" ]; then
      cat <<EOT >> ${APP_MANIFEST}
    NEW_RELIC_ENABLED: ${NEW_RELIC_ENABLED}
EOT
  fi

    if [ -n "${CF_ENV_PREFIX}" ]; then
        for cfg in $(compgen -e | grep ${CF_ENV_PREFIX}); do
            cat <<EOT >> ${APP_MANIFEST}
    ${cfg}: ${!cfg}
EOT
        done
    fi

    # login
    cf-login
    cf push ${APP_DEPLOY_NAME} -i ${NUMBER_INSTANCES:-2} -m ${MEMORY_SIZE:-512M} -p ${APP_PATH} -f ${APP_MANIFEST}
    RETURN_CODE=$?

    popd > /dev/null

    return ${RETURN_CODE}
}

run-integration-tests() {
    echo "run integration test against ${APP_URL}"
    local RETURN_CODE=0
    pushd ${PROJ_PATH} > /dev/null

    # Set staging URL variable, to be read by `gulp integration`
    export STAGING_URL=${APP_URL}

    # Temporarily Disable Blue/Green Tests until Saucelabs is back
    npm install
    npm run-script integration
    RETURN_CODE=$?

    popd > /dev/null

    return ${RETURN_CODE}
}

remove-app() {
    if [ -n "${1}" ]; then
        cf stop "${1}"
        cf delete "${1}" -f -r
    else
        echo "missing application name, failed to remove app."
    fi
}

dump-logs-app() {
    if [ -n "${1}" ]; then
        cf logs "${1}" --recent
    else
        echo "missing application name, failed to get app logs."
    fi
}

promote2prod() {
    local PROD_APP_URL="${APP_NAME}.${CF_DOMAIN}"
    # setup env variable for app
    cf map-route "${APP_DEPLOY_NAME}" "${CF_DOMAIN}" -n "${APP_NAME}"
    OUTDATED_APPS=$(cf apps | grep "${PROD_APP_URL}" | awk '{print $1}')
    for OLD_APP in $OUTDATED_APPS; do
        [ "${OLD_APP}" == "${APP_DEPLOY_NAME}" ] && continue

        cf unmap-route "${OLD_APP}" "${CF_DOMAIN}" -n "${APP_NAME}"
        remove-app "${OLD_APP}"
    done
}

# workflow
install-cf-cli
push2cf
RETURN_CODE=$?
if [ "$RETURN_CODE" -eq 0 ]; then
    promote2prod
else
    dump-logs-app "${APP_DEPLOY_NAME}"
    remove-app "${APP_DEPLOY_NAME}"
fi

cf logout

exit ${RETURN_CODE}
