//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

const express = require('express');
const controller = require('./invite.controller');

const router = express.Router();
router.post('/invite', controller.inviteUser);
module.exports = router;
