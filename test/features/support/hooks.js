'use strict';

const baseProduct = require('../../../server/api/products/staticData/newProduct.json');
const baseIntegration = require('../../../server/api/products/staticData/integrationTask.json');
const baseContent = require('../../../server/api/qualifications/staticData/baseContentDocument.json');
const baseCognitive = require('../../../server/api/products/staticData/cognitiveContent.json');
const COMM_TASK = require('../../../server/api/products/staticData/commerceTask.json');
const CONT_TASK = require('../../../server/api/products/staticData/contentTask.json');

var myHooks = function () {

  this.Before(function() {
    this.testUser = {
      _id: 'testUserId',
      fname: 'Bungaree',
      lname: 'Chubbins',
      email: 'testuser@test.com',
      features: [],
      products: [],
      roles: []
    };

    this.otherUser = {
      _id: 'otherUserId',
      fname: 'Otok',
      lname: 'Barleyfoot',
      email: 'otheruser@us.ibm.com',
      features: [],
      products: [],
      roles: ['provider']
    };

    this.unregistered = 'unregistered@us.ibm.com';

    this.testProduct = JSON.parse(JSON.stringify(baseProduct));
    this.testProduct.integration = JSON.parse(JSON.stringify(baseIntegration));
    this.testProduct._id = 'testProductId';
    this.testProduct.searchTerms = 'Test Product Larry Birdman';
    this.testProduct.offeringName = 'Test Product';
    this.testProduct.status = 'qualification_approved';
    this.testProduct.description = 'Test Product Description';
    this.testProduct.providerType = 'IBM';
    this.testProduct.wcm = JSON.parse(JSON.stringify(CONT_TASK));
    this.testProduct.wcm.goLiveDate = '2015-01-01T01:01:01.001Z';
    this.testProduct.cmc = JSON.parse(JSON.stringify(COMM_TASK));
    this.testProduct.cmc.goLiveDate = '2015-01-01T01:01:01.001Z';
    this.testProduct.offeringManager = {
      firstName: 'Larry',
      lastName: 'Birdman',
      phone: '',
      email: ''
    };
    this.testProduct.offeringData = {
      editors: [],
      invitedUsers: [],
        "tasks": {
        "content": "content",
        "commerce": "commerce",
        "integration": "integration"
      },
    };
    this.testProduct.countryMktConfig = {};

    this.blacklistDB.put({'_id': 'test', 'IOT': 'TEST',
      'area': 'Test', name: 'country1', code: 'code1'});

    this.testQualification = {};
    this.testQualification._id = 'testQualificationId';
    this.testQualification.offeringName = 'Test Qualification';
    this.testQualification.status = 'qualification_incomplete';
    this.testQualification.qualification = {};
    this.testQualification.lastModified = {};
    this.testQualification.blacklist = [];

    this.testContent = JSON.parse(JSON.stringify(baseContent));
    this.testContent._id = 'testContentId!en_draft';
    this.testContent.id = 'testContentId!en_draft';
    this.testContent.key = 'testContentId!en_draft';
    this.testContent.value.product.name = 'Test Product';
    this.testContent.value.product.description = 'Test Product Description';

    this.testCognitive = JSON.parse(JSON.stringify(baseCognitive));
    this.testCognitive._id = 'testContentId!en_draft';
    this.testCognitive.id = 'testContentId!en_draft';
    this.testCognitive.key = 'testContentId!en_draft';
    this.testCognitive.value.product.name = 'Test Product';
    this.testCognitive.value.product.description = 'Test Product Description';
  });

  //HACK ALERT: This is here becuase ng-file-upload tries to wrap the native
  //setRequestHeader method in a way that's not compatible with zombie.
  this.Before({tags: ['@uploadHack']}, function() {
    this.browser.on('opened', window => {
      window.XMLHttpRequest = (function(OrigXHR) {
        return function() {
          let xhr = new OrigXHR();
          xhr.setRequestHeader = (function(origReqHeader) {
            return function (header, value) {
              if (header === '__setXHR_') {
                value(this);
              } else {
                origReqHeader.apply(this, arguments);
              }
            };
          })(xhr.setRequestHeader);
          return xhr;
        };
      })(window.XMLHttpRequest);
    });
  });

  this.Before({tags: ['@popupHack']}, function() {
    this.browser.on('opened', window => {
      window.Element.prototype.prop = function() {
        return 0;
      };
    });
  });

  this.Before({tags: ['@debug']}, function() {
    this.browser.debug();
  });

  this.After(function() {
    this.browser.destroy();

    let promises = [];
    promises.push(clearDB(this.usersDB));
    promises.push(clearDB(this.productsDB));
    promises.push(clearDB(this.qualifDB));
    promises.push(clearDB(this.contentDB));
    promises.push(clearDB(this.publishDB));
    promises.push(clearDB(this.blacklistDB));
    promises.push(clearDB(this.invitedDB));
    promises.push(clearDB(this.serviceDB));

    return Promise.all(promises);
  });
};

function clearDB(database) {
  return database.allDocs()
    .then(results => {
      let docs = results.rows
        .filter(row => !row.id.startsWith('_design/'))
        .map(row => ({_id: row.id, _rev: row.value.rev, _deleted: true}));

      return database.bulkDocs(docs);
    });
}

module.exports = myHooks;
