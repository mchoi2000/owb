//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');
var _ = require('lodash');

function isAuthed() {
  return true;
}

function notAuthed() {
  return false;
}

var testReq = {
  user: {
    roles: ['admin'],
    products: ['product','testId']
  },
  params: {
    id: ''
  },
  body: {
    id: '',
    productId:'testProductId',
    currentOwnerId:'testOwner',
    editorId: 'testEditor'
  },
  isAuthenticated: isAuthed
};

var integrationProduct = {
  _id: 'testIntegration',
  offeringName: 'TEST Product with Integration',
  owner: 'testOwner',
  cmc: {},
  wcm: {},
  integration: {
    backplaneControllerId: 'BPC_MAIN_ID_1'
  }
};

var integrationProductWithParts = {
  _id: 'testIntegrationWithParts',
  offeringName: 'TEST Product with Integration & Parts',
  owner: 'testOwner',
  cmc: {
    partsList: [
      {
        part: 'PART1',
        backplaneControllerId: 'BPC_2_PART_ID_1'
      },
      {
        part: 'PART2',
        backplaneControllerId: 'BPC_2_PART_ID_2'
      }
    ]
  },
  wcm: {},
  integration: {
    backplaneControllerId: 'BPC_MAIN_ID_2'
  }
};

var testProd = {
  _id: 'testProductId',
  owner: 'testOwner',
  offeringData: {
    editors: ['testEditor']
  }
};

var dbStub   =  {
  get: function(id) {
    return new Promise(function promiseCallback(resolve, reject) {
      if (id === 'testProductId') {
        resolve(testProd);
      } else if (id === 'testIntegration') {
        resolve(integrationProduct);
      } else if (id === 'testIntegrationWithParts') {
        resolve(integrationProductWithParts);
      } else {
        reject('err');
      }
    });
  }
};

var mockRoles = function(options) {
  options.matchRelativePaths.should.be.true();

  var testAction = 'testAction';
  var req = {};
  var res = {
    status: function(code) {
      code.should.equal(403);
    },

    json: function(obj) {
      obj.message.should.equal('Unauthorized');
      obj.action.should.equal(testAction);
    }
  };
  options.failureHandler(req, res, testAction);

  var self = this;
  self.use = function(action, fn) {
    if (typeof action === 'function') {
      testReq.user.roles = ['admin'];
      action(testReq, 'testAction').should.be.true();
      testReq.user.roles = ['provider'];
      should(action(testReq, 'testAction')).be.undefined();
    } else if (action === 'authenticated') {
      testReq.isAuthenticated = isAuthed;
      fn(testReq).should.be.true();
      testReq.isAuthenticated = notAuthed;
      fn(testReq).should.be.false();
    } else if (action === 'admin') {
      testReq.user.roles = ['admin'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['notAdmin'];
      fn(testReq).should.be.false();
    } else if (action === 'academy') {
      testReq.user.roles = ['academy'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['notAcademy'];
      fn(testReq).should.be.false();
    } else if (action === 'access private content') {
      testReq.isAuthenticated = isAuthed;
      fn(testReq).should.be.true();
      testReq.isAuthenticated = notAuthed;
      should(fn(testReq)).be.undefined();
    } else if (action === 'register') {
      testReq.isAuthenticated = isAuthed;
      fn(testReq).should.be.true();
      testReq.isAuthenticated = notAuthed;
      should(fn(testReq)).be.undefined();
    } else if (action === 'logout') {
      testReq.isAuthenticated = isAuthed;
      fn(testReq).should.be.true();
      testReq.isAuthenticated = notAuthed;
      should(fn(testReq)).be.undefined();
    } else if (action === 'registered provider') {
      testReq.user.roles = ['provider'];
      testReq.user.registered = true;
      testReq.user.PWBPlatform = true;
      fn(testReq).should.be.true();
      testReq.user.roles = ['academy'];
      testReq.user.registered = true;
      fn(testReq).should.be.true();
      testReq.user.roles = ['fake'];
      testReq.user.registered = true;
      testReq.user.PWBPlatform = false;
      fn(testReq);
    } else if (action === 'unregistered provider') {
      testReq.user.roles = ['provider'];
      testReq.user.registered = false;
      testReq.user.PWBPlatform = true;
      fn(testReq).should.be.true();
      testReq.user.roles = ['academy'];
      testReq.user.registered = false;
      fn(testReq).should.be.true();
      testReq.user.roles = ['fake'];
      testReq.user.registered = false;
      testReq.user.PWBPlatform = false;
      fn(testReq);
    } else if (action === 'reviewer') {
      testReq.user.roles = ['cmmReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['operator'];
      fn(testReq).should.be.false();
    } else if (action === 'access product') {
      testReq.user.roles = ['qualificationReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['cmmReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['provider'];
      fn(testReq).should.be.false();
    } else if (action === 'access content') {
      testReq.user.roles = ['contentReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['cmmReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['provider'];
      fn(testReq).should.be.false();
      fn(testReq).should.be.false();
      testReq.body.id = 'product';
      fn(testReq).should.be.true();
      testReq.params.id = 'product';
      fn(testReq).should.be.true();
    } else if (action === 'create product') {
      testReq.user.roles = ['provider'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['notProvider'];
      fn(testReq).should.be.false();
    } else if (action === 'review qualification' || action === 'qualificationReviewer') {
      testReq.user.roles = ['qualificationReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['notReviewer'];
      fn(testReq).should.be.false();
    } else if (action === 'review content' || action === 'contentReviewer' ||
        action === 'download to translate' || action === 'upload translations') {
      testReq.user.roles = ['contentReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['notReviewer'];
      fn(testReq).should.be.false();
    } else if (action === 'cmmReviewer') {
      testReq.user.roles = ['cmmReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['notReviewer'];
      fn(testReq).should.be.false();
    } else if (action === 'commerceReviewer' ||
        action === 'review commerce' ||
        action === 'download csvs') {
      testReq.user.roles = ['commerceReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['notReviewer'];
      fn(testReq).should.be.false();
    } else if (action === 'access user info') {
      testReq.user.roles = ['cmmReviewer'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['notReviewer'];
      fn(testReq).should.be.false();
    } else if (action === 'change owner') {
      testReq.isAuthenticated = isAuthed;
      testReq.isAuthenticated = isAuthed;
      testReq.body.productId = 'wrongProductId';
      fn(testReq).then(function(res) {
        res.should.be.false();
      });
      testReq.body.productId = 'testProductId';
      fn(testReq).then(function(res) {
        res.should.be.true();
      });
    } else if (action === 'remove editor') {
      fn(testReq).should.be.false();
      testReq.isAuthenticated = isAuthed;
      testReq.body.productId = 'wrongProductId';
      fn(testReq).should.be.false();
      testReq.body.productId = 'testProductId';
      testReq.body.editorId = 'wrongEditorId';
      fn(testReq).should.be.false();
    } else if (action === 'translationBuild') {
      testReq.user.roles = ['translationBuild'];
      fn(testReq).should.be.true();
      testReq.user.roles = ['fail'];
      fn(testReq).should.be.false();
    } else if (action === 'access integration') {
      var intReq = _.cloneDeep(testReq);
      intReq.user.roles = ['provider'];
      intReq.user.products = ['testIntegration', 'testIntegrationWithParts', 'testProductId'];
      fn(intReq).then(function resolve(response) {
        response.should.be.false();
      });
    }
  };
};

describe('authorization rules', function() {
  it('should define rules', function() {
    proxyquire('./roles', {
      'connect-roles': mockRoles,
      '../../api/products/product.da.db': dbStub
    });
  });
});
