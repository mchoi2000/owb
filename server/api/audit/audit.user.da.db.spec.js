//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

//jshint unused: false
var proxyquire = require('proxyquire').noCallThru();
var should = require('should');
var util = require('../../components/utils');

var Errors = util.Errors;
var MockPouchWrapper = util.MockPouchWrapper;

describe('user data access', function () {

  beforeEach(function () {
    let self = this;

    jasmine.addMatchers({
      toFail: function () {
        return {
          compare: function (actual, expected) {
            return {
              pass: false,
              message: expected
            };
          }
        };
      }
    });

    self.pouchWrapper = new MockPouchWrapper('userDA');
  });

  afterEach(function (done) {
    let self = this;
    self.pouchWrapper.close()
      .then(function () {
        done();
      })
      .catch(function () {
        done();
      });
  });

  it('should create user audit', function (done) {
    let self = this;
    let da = proxyquire('./audit.user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUserAudit({_id: 'testId', test: 'testValue'})
      .then(function (response) {
        response.ok.should.be.true();
        done();
      })
      .catch(function (reason) {
        expect().toFail(reason.toString());
        done();
      });
  });

  it('should create user audit(OWB Error)', function (done) {
    let self = this;
    let da = proxyquire('./audit.user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUserAudit()
      .then(function () {
        expect().toFail('Creation should not have succeeded');
        done();
      })
      .catch(function (reason) {
        reason.should.be.instanceof(Errors.OWBError);
        done();
      });
  });

  it('should get user audit', function(done) {
    let self = this;
    let da = proxyquire('./audit.user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUserAudit({test: 'testValue'})
      .then(function(response) {
        return da.getUserAudit(response.id);
      })
      .then(function(document) {
        document.test.should.equal('testValue');
        done();
      })
      .catch(function(reason) {
        expect().toFail(reason.toString());
        done();
      });
  });

  it('should get audit (Missing Error)', function(done) {
    let self = this;
    let da = proxyquire('./audit.user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.getUserAudit('notFound')
      .then(function() {
        expect().toFail('Retrieval of doc should not have succeeded');
        done();
      })
      .catch(function(reason) {
        done();
      });
  });

  it('should get audit (Error)', function(done) {
    let self = this;
    let da = proxyquire('./audit.user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.getUserAudit()
      .then(function() {
        expect().toFail('Retrieval of doc should not have succeeded');
        done();
      })
      .catch(function(reason) {
        done();
      });
  });
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  it('should get all users audits', function (done) {
    let self = this;
    let da = proxyquire('./audit.user.da.db', {pouchdb: self.pouchWrapper.MockPouch});
    da.createUserAudit({_id: 'testId'})
      .then(function () {
        return da.createUserAudit({_id: 'testId2'});
      })
      .then(function () {
        return da.getAllUsersAudits();
      })
      .then(function (response) {
        response.total_rows.should.equal(4);
        done();
      })
      .catch(function (reason) {
        expect().toFail(reason);
        done();
      });
  });

  it('should query for user audits', function (done) {
    let self = this;
    let da = proxyquire('./audit.user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    let query = {
      selector: {
        _id: {$gte: null},
        userId: 'testValue4'
      }
    };
    Promise.all([da.createUserAudit({userId: 'testValue4', userEmail: 'testValue4',
      event:{type: 'invite'}}),
     da.createUserAudit({userId: 'testValue5', userEmail: 'testValue5', event:{type: 'invite'}})])
      .then(function get() {
        return da.queryUserAudits(query);
      })
      .then(function (response) {
        expect(response).toBeDefined();
        expect(response.docs.length).toEqual(1);
        expect(response.docs[0].userId).toEqual('testValue4');
        done();
      })
      .catch(function reject(reason) {
        expect().toFail(reason);
        done();
      });
  });

  it('should error on query for User audits', function (done) {
    let self = this;
    let da = proxyquire('./audit.user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUserAudit({userId: 'testValue4', userEmail: 'testValue4', event:{type: 'invite'}})
      .then(function get() {
        return da.queryUserAudits('failedQuery');
      })
      .then(function (response) {
        expect().toFail(response);
        done();
      })
      .catch(function reject(reason) {
        expect(reason).toBeDefined();
        done();
      });
  });

});
