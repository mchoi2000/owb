#!/usr/bin/env bash

#Licensed Materials - Property of IBM
#
#@ Copyright IBM Corp. 2015  All Rights Reserved
#
#US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

set -e
export CF_TARGET=https://api.w3ibm.bluemix.net && \
	export CFCI_NEW_RELIC_APP_NAME="operator-workbench-us-prod" && \
	./bin/deploy_to_bluemix.sh && \
	export CF_DOMAIN=w3ibm.mybluemix.net && \
	export CF_TARGET=https://api.w3ibm.bluemix.net && \
	export CFCI_NEW_RELIC_APP_NAME="operator-workbench-us-stage" && \
	export APP_NAME=$STAGE_APP_NAME && \
	export CF_SPACE=$STAGE_CF_SPACE && \
	export APP_MANIFEST_PATH=$STAGE_APP_MANIFEST_PATH && \
	export NUMBER_INSTANCES=$STAGE_NUMBER_INSTANCES && \
	export CF_NODE_ENV=$STAGE_CF_NODE_ENV && \
	export CFCI_WEB_ROOT=$STAGE_CFCI_WEB_ROOT && \
	export CFCI_SOFTLAYER_CDN_URL=$STAGE_CFCI_SOFTLAYER_CDN_URL && \
	gulp build && \
	./bin/deploy_to_bluemix.sh
