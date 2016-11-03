/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

'use strict';
var express = require('express');
var controller = require('./locales.controller');

var router = express.Router();
router.get('/', controller.getCountriesWithLang);

module.exports = router;
