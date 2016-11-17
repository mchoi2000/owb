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
  self.users = new PouchDB('users', {db: require('memdown')});

  self.getUser = function(identifier) {
    if (identifier === 'user') {
      return Promise.resolve({
        _id: identifier,
        products:[
          'testProduct',
          'userAlreadyOnProduct'
        ],
        PWBPlatform: true
      });
    } else if (identifier === 'userToBeRemovedFromProduct') {
      return Promise.resolve({
        _id: identifier,
        products:[
          'removeProductTest'
        ],
        PWBPlatform: true
      });
    } else {
      return Promise.reject('not user');
    }
  };

  self.findUser = function(email) {
    if (email === 'user') {
      return Promise.resolve({
        docs: [{
          _id:'user',
          products:[
            'testProduct',
            'userAlreadyOnProduct'
          ],
          PWBPlatform: true
        }]
      });
    } else {
      return Promise.reject({
        identifier: email
      });
    }
  };

  self.updateUser = function(user, id, rev) {
    if (id) {
      user._id = id;
    }

    if (rev) {
      user._rev = rev;
    }

    return self.users.put(user);
  };

  self.createUser = function(user) {
    return self.users.post(user);
  };

  self.getAllUsers = function() {
    return Promise.resolve(['list', 'of', 'users']);
  };

  self.removeProduct = function(id, productId) {
    if (id === 'testUser' && productId === 'testProduct') {
      return Promise.resolve('removed product');
    } else {
      return Promise.reject('failed to removed product');
    }
  };

  self.close = function() {
    return self.users.destroy();
  };

  self.adminsGet = function(id) {
    if (id === 'admin') {
      return Promise.resolve('admin');
    } else {
      return Promise.reject('not admin');
    }
  };

  self.qualReviewersGet = function(id) {
    if (id === 'qualReviewers') {
      return Promise.resolve('qualReviewers');
    } else {
      return Promise.reject('not qualReviewers');
    }
  };

  self.cmcReviewersGet = function(id) {
    if (id === 'cmcReviewers') {
      return Promise.resolve('cmcReviewers');
    } else {
      return Promise.reject('not cmcReviewers');
    }
  };

  self.cmmReviewersGet = function(id) {
    if (id === 'cmmReviewers') {
      return Promise.resolve('cmmReviewers');
    } else {
      return Promise.reject('not cmmReviewers');
    }
  };

  self.contentReviewersGet = function(id) {
    if (id === 'contentReviewers') {
      return Promise.resolve('contentReviewers');
    } else {
      return Promise.reject('not contentReviewers');
    }
  };

  self.queryUsers = function(query) {
    if (query) {
      expect(query.selector).toBeDefined();
      expect(query.fields).toBeDefined();
      return Promise.resolve({docs: [{email: 'test@test.com', countries: ['test1']}]});
    } else {
      return Promise.reject('Error on getCMMByCountry');
    }
  };
};

describe('user service', function() {
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

    self.mockDA = new MockDA('user');
  });

  afterEach(function(done) {
    Promise.all([
      this.mockDA.close()
    ])
    .then(() => done());
  });

  it('should add admin', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../../components/email': {},
      '../features/feature.controller': {
        getFeatures: function() {
          return Promise.resolve([{_id:'test'}]);
        }
      }
    });

    var admin = {
      email: 'admin',
      fname: 'test',
      lname: 'user'
    };
    service.addUser(admin).then(
      function(response) {
        response.ok.should.equal(true);
        expect(response.id).toBeDefined();
        expect(response.rev).toBeDefined();
        done();
      });
  });

  it('should add cmmReviewers', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../../components/email': {},
      '../features/feature.controller': {
        getFeatures: function() {
          return Promise.resolve([{_id:'test'}]);
        }
      }
    });

    var admin = {
      email: 'cmmReviewer',
      fname: 'test',
      lname: 'user'
    };
    service.addUser(admin).then(
      function(response) {
        response.ok.should.equal(true);
        expect(response.id).toBeDefined();
        expect(response.rev).toBeDefined();
        done();
      });
  });

  it('should add invited user', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    var invitedUser = {
      email: 'assignRoleTestInvitee',
      fname: 'test',
      lname: 'user'
    };
    service.addUser(invitedUser).then(
      function(response) {
        response.ok.should.equal(true);
        expect(response.id).toBeDefined();
        expect(response.rev).toBeDefined();
        done();
      });
  });

  it('should fail to invited user', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    var invitedUser = {
      email: 'inviteeWithFakeProduct',
      fname: 'test',
      lname: 'user'
    };
    service.addUser(invitedUser).then(
      function(response) {
        response.ok.should.equal(true);
        expect(response.id).toBeDefined();
        expect(response.rev).toBeDefined();
        done();
      });
  });

  it('should add provider', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../products/product.da.db': {},
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    var provider = {
      email: 'provider',
      fname: 'test',
      lname: 'user',
      PWBPlatform: true
    };
    service.addUser(provider).then(
      function(response) {
        response.ok.should.equal(true);
        expect(response.id).toBeDefined();
        expect(response.rev).toBeDefined();
        done();
      });
  });

  it('should get user', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    service.getUser('user').then(
      function(response) {
        expect(response._id).toEqual('user');
        expect(response.products).toEqual(['testProduct', 'userAlreadyOnProduct']);
        expect(response.PWBPlatform).toEqual(true);
        done();
      });
  });

  it('should show all user', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    service.showAll().then(function() {
      done();
    });
  });

  it('should update user', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    service.updateUser({_id:'user', products:['value']}).then(
      function(response) {
        response.ok.should.equal(true);
        expect(response.id).toBeDefined();
        expect(response.rev).toBeDefined();
        done();
      }
    );
  });

  it('should get users by given query', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../products/product.da.db': {},
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    service.getCMMByCountry({selector: '', fields: []}).then(function(response) {
        expect(response).toBeDefined();
        expect(response).toEqual([{email: 'test@test.com', countries: ['test1']}]);
        done();
      });
  });

  it('should get users by given query', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../products/product.da.db': {},
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    service.getAllCMMs({selector: '', fields: []}).then(function(response) {
        expect(response).toBeDefined();
        expect(response).toEqual([{email: 'test@test.com', countries: ['test1']}]);
        done();
      });
  });

  it('should join locale', function(done) {
    let self = this;

    let service = proxyquire('./user.service', {
      './user.da.db': self.mockDA,
      '../products/product.da.db': {},
      '../../components/email': {},
      '../features/feature.controller': {}
    });

    service.joinLocale({_id:'user'}, [{'locale': 'en-us', 'roles': ['editor']}])
    .then(function(response) {
        expect(response).toBeDefined();
        done();
      });
  });
});
