//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

var express = require('express');
var controller = require('./user.controller');
var roles = require('../../middleware/auth/roles');

var router = express.Router();
router.get('/', controller.index);
router.get('/all', roles.is('admin'), controller.showAll);
router.get('/:id', roles.can('access user info'), controller.show);
router.post('/removeUsers', roles.can('access user info'), controller.removeUsers);
router.post('/joinLocale', roles.can('access user info'), controller.joinLocale);
router.post('/updateUser', roles.can('access user info'), controller.updateUser);
module.exports = router;
