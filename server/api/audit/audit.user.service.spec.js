//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

/* jshint unused: false */
const should = require('should');
var proxyquire = require('proxyquire').noCallThru();
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

let MockDA = function() {
  let self = this;
  self.audits = new PouchDB('audit', {db: require('memdown')});

  self.createUserAudit = function (audit) {
    return self.audits.post(audit);
  };

  self.queryUserAudits = function (query) {
    if (query) {
      expect(query.selector).toBeDefined();
      if (query.selector.userEmail === 'someone@ibm.com' || query.selector.userId === 'someId') {
        return Promise.resolve({
          docs: [{
            _id: 'id',
            userId: 'someId',
            userEmail: 'someone@ibm.com',
            event: {type: 'invite'}
          }]
        });
      }
      else {
        return Promise.resolve({docs:[]});
      }

    }
    else {
      return Promise.reject('Error on querying user audits');
    }
  };

  self.getAllUsersAudits = function () {
    return Promise.resolve(['list', 'of', 'audits']);
  };

  self.close = function () {
    return self.audits.destroy();
  };
};

describe('Audit service Tests - ', function() {
  beforeEach(function() {
    var self = this;

    jasmine.addMatchers({
      toFail: function() {
        return {
          compare: function(actual, expected) {
            return {
              pass: false,
              message: expected
            };
          }
        };
      }
    });

    self.mockDA = new MockDA('audit');
  });

  afterEach(function(done) {
    Promise.all([
     this.mockDA.close()
      ])
      .then(() => done());
  });

  it('should add audit', function(done) {
    let self = this;

    let service = proxyquire('./audit.user.service', {
      './audit.user.da.db': self.mockDA
    });

    var audit = {
      _id: 'id',
      userId: 'someId',
      userEmail: 'someone@ibm.com',
      event: {type: 'invite'}
    };
    service.addUserAudit(audit).then(
      function(response) {
        response.ok.should.equal(true);
        expect(response.id).toBeDefined();
        expect(response.rev).toBeDefined();
        done();
      });
  });

  it('should get audit with email', function(done) {
    let self = this;

    let service = proxyquire('./audit.user.service', {
      './audit.user.da.db': self.mockDA
    });

    service.getUserAuditsWithEmail('someone@ibm.com').then(
      function(response) {
        expect(response.docs[0].userId).toEqual('someId');
        done();
      });
  });

  it('should not get audit with email', function(done) {
    let self = this;

    let service = proxyquire('./audit.user.service', {
      './audit.user.da.db': self.mockDA
    });

    service.getUserAuditsWithEmail('someone234@ibm.com').catch(
      function(response) {
        expect(response.err.status === '404');
        done();
      });
  });

  it('should get audit with Id', function(done) {
    let self = this;

    let service = proxyquire('./audit.user.service', {
      './audit.user.da.db': self.mockDA
    });

    service.getUserAuditsWithId('someId').then(
      function(response) {
        expect(response.docs[0].userEmail).toEqual('someone@ibm.com');
        done();
      });
  });

  it('should not get audit with Id', function(done) {
    let self = this;

    let service = proxyquire('./audit.user.service', {
      './audit.user.da.db': self.mockDA
    });

    service.getUserAuditsWithId('someId23').catch(
      function(response) {
        expect(response.err.status === '404');
        done();
      });
  });

  it('should show all audits', function(done) {
    let self = this;

    let service = proxyquire('./audit.user.service', {
      './audit.user.da.db': self.mockDA
    });

    service.showAllUserAudits().then(function() {
      done();
    });
  });
});
