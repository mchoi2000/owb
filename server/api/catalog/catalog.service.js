//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const config = require('../../config/environment');
const logger = require('../../components/logger').get('db');
const denodeify = require('../../components/utils').denodeify;
const url = require('url');
const request = denodeify(require('request'));
const _ = require('lodash');
const CONTACT_MODULE_PATH = '/2444/broadest_nodes';

module.exports = {
  getTMTContactModules: getTMTContactModules
};

function getTMTContactModules() {
  let urlOptions = {
    protocol: 'https',
    host: config.w3APIs.taxonomies + CONTACT_MODULE_PATH,
    query: {'client_id': config.w3APIs.w3ClientSecret}
  };

  return request({
    url: url.format(urlOptions),
    method: 'GET'
  })
  .then(function resolveRequest(response) {
    if (response.statusCode === 200) {
      let list = JSON.parse(response.body);
      return _.fromPairs(
        list._items.map(item => ([item._id, _.map(item['_relation_codes'].narrower, 'node')])
      ));
    } else {
      throw {
        statusCode: response.statusCode,
        message: JSON.parse(response.body)
      }
    }
  });
}
