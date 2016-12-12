//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const config = require('../../config/environment');
const request = require('request');
var logger = require('../../components/logger').get('db');

module.exports = {
  getOfferingsByLanguage: getOfferingsByLanguage
};

function getOfferingsByLanguage(language) {
  var pwbConfig = config.pwbConfig;
  var options = {
    url: pwbConfig.hostURL + pwbConfig.webRoot + pwbConfig.api.getDocsWithTranslation +
         '?language=' + language,
    headers: {
      'Authorization': 'JWT ' + pwbConfig.secureToken
    }
  };
  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        return resolve(JSON.parse(body));
      } else {
        return reject(error);
      }
    });
  });
}
