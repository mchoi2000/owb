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

describe('user data access', function() {

  beforeEach(function() {
    let self = this;

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

    self.pouchWrapper = new MockPouchWrapper('userDA');
  });

  afterEach(function(done) {
    let self = this;
    self.pouchWrapper.close()
      .then(function() {
        done();
      })
      .catch(function() {
        done();
      });
  });

  it('should create user', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser({_id: 'testId', test: 'testValue'})
      .then(function(response) {
        response.ok.should.be.true();
        done();
      })
      .catch(function(reason) {
        expect().toFail(reason.toString());
        done();
      });
  });

  it('should create user (PWB Error)', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser()
      .then(function() {
        expect().toFail('Creation should not have succeeded');
        done();
      })
      .catch(function(reason) {
        reason.should.be.instanceof(Errors.PWBError);
        done();
      });
  });

  it('should get user', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser({test: 'testValue'})
      .then(function(response) {
        return da.getUser(response.id);
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

  it('should get user (Missing Error)', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.getUser('notFound')
      .then(function() {
        expect().toFail('Retrieval of doc should not have succeeded');
        done();
      })
      .catch(function(reason) {
        done();
      });
  });

  it('should get user (Error)', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.getUser()
      .then(function() {
        expect().toFail('Retrieval of doc should not have succeeded');
        done();
      })
      .catch(function(reason) {
        done();
      });
  });

  it('should query users', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser({email: 'testValue', status: 'testStatus'})
      .then(function(response) {
        response.ok.should.be.true();
        return da.createUser({email: 'testValue2', status: 'testStatus2'});
      })
      .then(function(response) {
        response.ok.should.be.true();
        return da.findUser('testValue');
      })
      .then(function(results) {
        results.docs.length.should.equal(1);
        results.docs[0].status.should.equal('testStatus');
        done();
      })
      .catch(function(reason) {
        expect().toFail(reason.toString());
        done();
      });
  });

  it('should fail to query users', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser({email: 'testValue', status: 'testStatus'})
      .then(function(response) {
        response.ok.should.be.true();
        return da.createUser({email: 'testValue2', status: 'testStatus2'});
      })
      .then(function(response) {
        response.ok.should.be.true();
        return da.findUser('testValue3');
      })
      .then(function(results) {
        results.docs.length.should.equal(1);
        results.docs[0].status.should.equal('testStatus');
        done();
      })
      .catch(function(reason) {
        reason.err.status.should.equal(404);
        reason.err.message.should.equal('missing');
        reason.err.error.should.equal(true);
        done();
      });
  });

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  it('should get all users', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});
    da.createUser({_id: 'testId'})
      .then(function() {
        return da.createUser({_id: 'testId2'});
      })
      .then(function() {
        return da.getAllUsers();
      })
      .then(function(response) {
        response.total_rows.should.equal(4);
        done();
      })
      .catch(function(reason) {
        expect().toFail(reason);
        done();
      });
  });

  it('should update user', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser({test: 'testValue'})
      .then(function(response) {
        return da.updateUser({_id:response.id, _rev:response.rev, test: 'testValue2'});
      })
      .then(function(response) {
        response.ok.should.be.true();
        return da.getUser(response.id);
      })
      .then(function(doc) {
        doc.test.should.equal('testValue2');
        done();
      })
      .catch(function(reason) {
        expect().toFail(reason.toString());
        done();
      });
  });

  it('should fail to update user (Conflict Error)', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser({test: 'testValue'})
      .then(function(response) {
        return da.updateUser({_id:response.id, test: 'testValue2'});
      })
      .catch(function(reason) {
        reason.name.should.equal('ConflictError');
        done();
      });
  });

  it('should fail to update user (PWB Error)', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser({test: 'testValue'})
      .then(function(response) {
        return da.updateUser({id:response.id, test:'testValue2'});
      })
      .then(function() {
        expect().toFail('Update of doc should not have succeeded');
        done();
      })
      .catch(function(reason) {
        reason.name.should.equal('PWBError');
        done();
      });
  });

  /*it('should fail to get admin', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.getRoles('testValue')
      .catch(function(reason) {
        done();
      });
  }); */

  it('should query for users', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    let query = {
      selector: {
        _id: {$gte: null},
        countries: {$elemMatch: {$eq: 'US'}},
        roles: {$elemMatch: {$eq: 'role1'}}
      },
      fields: ['_id', 'countries', 'email', 'fname', 'lname']
    };

    Promise.all([da.createUser({roles: 'role1', countries: ['US']}),
      da.createUser({roles: ['role1', 'role2', 'role3'], countries: ['US']})])
      .then(function get() {
        return da.queryUsers(query);
      })
      .then(function(response) {
        expect(response).toBeDefined();
        expect(response.docs.length).toEqual(1);
        expect(response.docs[0].countries).toEqual(['US']);
        done();
      })
      .catch(function reject(reason) {
        expect().toFail(reason);
        done();
      });
  });

  it('should error on query for Users', function(done) {
    let self = this;
    let da = proxyquire('./user.da.db', {pouchdb: self.pouchWrapper.MockPouch});

    da.createUser({roles: ['role1', 'role2', 'role3'], countries: ['US']})
      .then(function get() {
        return da.queryUsers('failedQuery');
      })
      .then(function(response) {
        expect().toFail(response);
        done();
      })
      .catch(function reject(reason) {
        expect(reason).toBeDefined();
        done();
      });
  });

});
