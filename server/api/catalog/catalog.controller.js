//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
const logger = require('../../components/logger').get('db');
let catalogService = require('./catalog.service');

module.exports = {
  getTMTContactModules: getTMTContactModules
};

function getTMTContactModules(req, res) {
  catalogService.getTMTContactModules()
  .then(function resolve(response) {
    res.status(200).json(response);
  })
  .catch(function reject(error) {
    logger.error('Error getting the TMT Contact Modules - ');
    logger.error(error);
    res.status(500).json({reason: 'Server Error'});
  });
}
