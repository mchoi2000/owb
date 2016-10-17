//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

describe('Collaborate Modal Spec', function() {
  var ctrl;
  var $httpBackend;
  var modalInstance = {
    close: jasmine.createSpy('modalInstance.close'),
    dismiss: jasmine.createSpy('modalInstance.dismiss'),
    result: {
      then: jasmine.createSpy('modalInstance.result.then')
    }
  };
  var $timeout;
  var user1 = {
    _id: 'user1@ibm.com',
    email:'user1@ibm.com',
    fname:'user1',
    lname:'user1'
  };
  var user2 = {
    _id: 'user2@ibm.com',
    email:'user2@ibm.com',
    fname:'user2',
    lname:'user2'
  };
  var user3 = {
    _id: 'user3@ibm.com',
    email:'user3@ibm.com',
    fname:'user3',
    lname:'user3'
  };
  var UserService = {
    getUser: function (email) {
      if (email === user1.email) {
        return {
            then: function(callback) {return callback(user1);}
          };
      }
      if (email === user2.email) {
        return {
            then: function(callback) {return callback(user2);}
          };
      }
      if (email === user3.email) {
        return {
            then: function(callback) {return callback(user3);}
          };
      }
    },
    inviteUser: function (invitees) {
      return {
        then: function(callback) {
          return callback(invitees);
        }
      };
    },
    resendInvite: function (inviteData) {
      expect(inviteData.invitedUserEmail).toEqual('user1@ibm.com');
      return inviteData;
    },
    removeUsers: function(data) {
      return {
          then: function(callback, errorCallback) {
            if (data.editorIds.length > 0) {
              return callback(user1);
            } else {
              return errorCallback({err: 'cannot find the user'});
            }
          }
        };
    }
  };
  var timeNow = Date.now() / 1000;
  var testProduct = {
    _id: 'testId',
    offeringName: 'New Product Offering',
    offeringData: {
      owner: 'user1@ibm.com',
      editors: ['user2@ibm.com'],
      invitedUsers:[{email: 'user3@ibm.com', lastSentAt: timeNow}]
    }
  };
  var data = {
    product: testProduct,
    currentUser: user2
  };

  var ProductsFactory = {
    getProduct: function (id) {
      return {
        then: function(successCallback, errorCallback) {
          if (id === 'testId') {
            return successCallback({data:testProduct});
          } else {
            return errorCallback({err: 'Cannot find the product'});
          }
        }
      };
    }
  };

  var $window = {
    getWidth: function(testData) {
      testData = 200;
      return testData;
    }
  };

  beforeEach(module('common.collab'));

  beforeEach(inject(function(_$httpBackend_, _$timeout_, $controller) {
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
    ctrl = $controller('CollaborateModalController', {
      $uibModalInstance: modalInstance,
      UserService: UserService,
      ProductsFactory: ProductsFactory,
      modalData: data,
      $window: $window
    });
  }));

  it('should change the removeEditor flag when removing an editor', function() {
    ctrl.removeEditor('user2@ibm.com');
    expect(ctrl.confirmChange.removeEditor).toEqual(true);
  });

  it('should instantiate the controller properly', function () {
    expect(ctrl).not.toBeUndefined();
  });

  it('should dismiss the modal when clicked on \'Done\' ', function () {
    ctrl.closeModal();
    expect(modalInstance.close).toHaveBeenCalled();
  });

  it('should be initalized with the correct product', function() {
    ctrl.initialize();
    expect(ctrl.product).toEqual(testProduct);
  });

  it('should be initalized with the correct owner', function() {
    ctrl.initialize();
    expect(ctrl.productOwner).toEqual(user1);
  });

  it('should be initalized with the correct current user', function() {
    ctrl.initialize();
    expect(ctrl.currentUser).toEqual(user2);
  });

  it('should be initalized with the correct editor list', function() {
    ctrl.initialize();
    expect(ctrl.editors).toEqual([user2]);
  });

  it('should be initalized with the correct \'confirmChange{}\' flag object', function() {
    ctrl.initialize();
    expect(ctrl.confirmChange.changeOwner).toEqual(false);
  });

  it('should mark a non ibm email as invalid ', function() {
    expect(ctrl.checkValidIBMEmail('user2@fake.com')).toEqual(false);
  });

  it('should check if any any in invitees is invalid with all valid emails', function() {
    ctrl.inviteesList = [
      {email: 'test1@us.ibm.com', valid: true},
      {email: 'test2@us.ibm.com', valid: true},
      {email: 'test3@ibm.com', valid: true}
    ];
    expect(ctrl.checkValidEmailAll()).toEqual(true);
  });

  it('should check if any any in invitees is invalid with invalid emails', function() {
    ctrl.inviteesList = [
      {email: 'test1', valid: false},
      {email: 'test2@bademail.com', valid: false},
      {email: 'test3@us.ibm.com', valid: true},
      {email: 'test4@ibm.com', valid: true}
    ];
    expect(ctrl.checkValidEmailAll()).toEqual(false);
  });

  it('should change to the correct owner and set the changeowner flag object', function() {
    ctrl.changeOwner('user2@ibm.com');
    expect(ctrl.product.offeringData.owner).toEqual('user2@ibm.com');
    expect(ctrl.confirmChange.changeOwner).toEqual(true);
  });

  it('should cancel change', function() {
    ctrl.confirmChange.changeOwner = true;
    ctrl.cancelChange();
    ctrl.confirmChange.changeOwner = false;
    ctrl.cancelChange();
  });

  it('should remove user', function() {
    ctrl.removeEditor('user1@ibm.com');
  });

  it('should undo removing an editor', function() {
    ctrl.editorsToRemove = ['user2@ibm.com'];
    ctrl.undoRemoveEditor('user2@ibm.com');
    expect(ctrl.editorsToRemove).toEqual([]);
  });

  it('should undo removing an editor when multiple editors are selected', function() {
    ctrl.editorsToRemove = ['a@us.ibm.com', 'b@us.ibm.com', 'c@us.ibm.com', 'd@us.ibm.com'];
    ctrl.undoRemoveEditor('b@us.ibm.com');
    expect(ctrl.editorsToRemove).toEqual(['a@us.ibm.com', 'c@us.ibm.com', 'd@us.ibm.com']);
  });

  it('should resend invite', function() {
    expect(ctrl.resentClicked).toEqual(false);
    ctrl.resendInvite('user1@ibm.com');
    expect(ctrl.resentClicked).toEqual(true);
  });

  it('should check last sent time of editor', function() {
    ctrl.invitedUsersList = [{
      email: 'user1@ibm.com',
      lastSent: ''
    }];
    ctrl.resendInvite('user1@ibm.com');
    expect(ctrl.product.offeringData.invitedUsers[0].lastSentAt).toEqual(timeNow);
  });

  it('should reset the owner change flag upon saving', function() {
    ctrl.initialize();
    ctrl.confirmChange.changeOwner = true;
    ctrl.changeOwner('user1@ibm.com');
    ctrl.saveChange();
    expect(ctrl.confirmChange.changeOwner).toEqual(false);
    $httpBackend.expectPUT('api/products/changeOwner',
    {productId:'testId', currentOwnerId:'user2@ibm.com', newOwnerId:'user1@ibm.com'})
    .respond(200, {ok: true});
    $httpBackend.flush();
  });

  it('should save after removing an editor if not owner', function() {
    ctrl.initialize();
    ctrl.removeEditor('user2@ibm.com');
    ctrl.saveChange();
    expect(ctrl.confirmChange.removeEditor).toEqual(false);
  });

  it('should save after removing an editor if user is owner', function() {
    ctrl.initialize();
    ctrl.currentUser = user1;
    ctrl.removeEditor('user2@ibm.com');
    ctrl.saveChange();
    expect(ctrl.confirmChange.removeEditor).toEqual(false);
  });

  it('should error on save when removing editor', function() {
    ctrl.initialize();
    ctrl.currentUser = user1;
    ctrl.product = {
      _id: 'errorId',
      offeringName: 'New Product Offering',
      owner: 'user1@ibm.com',
      editors: ['user2@ibm.com'],
      invitedUsers:[{email: 'user3@ibm.com', lastSentAt: timeNow}]
    };
    ctrl.removeEditor('user2@ibm.com');
    ctrl.saveChange();
  });

  it('should error on save and reload products', function() {
    ctrl.initialize();
    ctrl.removeEditor('user5@ibm.com');
    ctrl.saveChange();
    expect(ctrl.confirmChange.removeEditor).toEqual(false);
  });

  it('should error on save and reload products', function() {
    ctrl.initialize();
    ctrl.confirmChange.changeOwner = true;
    ctrl.changeOwner('user1@ibm.com');
    ctrl.saveChange();
    expect(ctrl.confirmChange.changeOwner).toEqual(false);
    $httpBackend.expectPUT('api/products/changeOwner',
    {productId:'testId', currentOwnerId:'user2@ibm.com', newOwnerId:'user1@ibm.com'})
    .respond(404, {ok: true});
    $httpBackend.flush();
  });

  it('should error on save if editor list is not defined', function() {
    ctrl.initialize();
    ctrl.removeEditor();
    ctrl.editorsToRemove.length = [];
    ctrl.saveChange();
  });

  it('should not change owner when no owner is passed', function() {
    ctrl.initialize();
    ctrl.changeOwner();
  });

  it('should revert product owner to original owner ', function() {
    ctrl.initialize();
    ctrl.changeOwner('user2@ibm.com');
    ctrl.cancelChange();
    expect(ctrl.confirmChange.changeOwner).toEqual(false);
    expect(ctrl.product.owner).toEqual(testProduct.owner);
  });

  it('should send invitations ', function() {
    // Covers branch with invalid and valid emails
    var fakeInputFromModal = [
      {email: 'test', valid: false},
      {email: 'test@us.ibm.com', valid: true},
      {email: 'anotherUser@us.ibm.com', valid: true},
      {email: 'wrongemail', valid: false}
    ];

    ctrl.sendInvitations(fakeInputFromModal);

    // Covers branch with only valid emails
    fakeInputFromModal = {email: 'test@us.ibm.com', valid: true};
    ctrl.sendInvitations(fakeInputFromModal);

    // Covers branch with only invalid emails
    fakeInputFromModal = {email: 'test', valid: false};
    ctrl.sendInvitations(fakeInputFromModal);
  });

  it('should update the width of invitees field with no invitees', function() {
    // Covers branch for the first email inputted
    var spy = spyOn(document, 'querySelector').and.callFake(function() {
      return {
        style: {
          width: ''
        }
      };
    });

    ctrl.updateInviteesInputWidth(0, 'testemai11@us.ibm.com', false);
    $timeout.flush();
    spy.and.callThrough();
  });

  it('should create a new invitee and set width under maxRowLength when comma pressed', function() {
    var mockWindow;
    var spy;

    spy = spyOn(angular, 'element').and.callFake(function () {
      mockWindow = jasmine.createSpy('windowElement');
      mockWindow.width = jasmine.createSpy('width').and.callFake(function(testString) {
        testString = 200;
        return testString;
      });
      return mockWindow;
    });

    ctrl.updateInviteesInputWidth(0, 'testemai11@us.ibm.com',
    {
      keyCode: 188,
      preventDefault: function() {return;}
    });

    $timeout.flush();
    spy.and.callThrough();
  });

  it('should create a new invitee and set width over maxRowLength when comma pressed', function() {
    var mockWindow;
    var spy;

    spy = spyOn(angular, 'element').and.callFake(function () {
      mockWindow = jasmine.createSpy('windowElement');
      mockWindow.width = jasmine.createSpy('width').and.callFake(function(testString) {
        testString = 700;
        return testString;
      });
      return mockWindow;
    });

    ctrl.updateInviteesInputWidth(0, 'testemai11@us.ibm.com',
    {
      keyCode: 188,
      preventDefault: function() {return;}
    });

    $timeout.flush();
    spy.and.callThrough();
  });

  it('should update width of invitees field over maxRowLength for multiple invitees', function() {
    var mockWindow;
    var spy;

    spy = spyOn(angular, 'element').and.callFake(function () {
      mockWindow = jasmine.createSpy('windowElement');
      mockWindow.width = jasmine.createSpy('width').and.callFake(function(testString) {
        testString = 700;
        return testString;
      });
      return mockWindow;
    });

    ctrl.inviteesList = [
      {
        email: 'test',
        valid: false,
        newEmail: '',
        focused: false
      },
      {
        email: 'testemail1@us.ibm.com',
        valid: true,
        newEmail: '',
        focused: false
      },
      {
        email: 'testemail2@us.ibm.com',
        valid: true,
        newEmail: '',
        focused: false
      }
    ];

    ctrl.updateInviteesInputWidth(1, 'testemai13@us.ibm.com', false);

    $timeout.flush();
    spy.and.callThrough();
  });

  it('should remove invitee with multiple invitees already added ', function() {
    var mockWindow;
    var spy;

    spy = spyOn(angular, 'element').and.callFake(function () {
      mockWindow = jasmine.createSpy('windowElement');
      mockWindow.width = jasmine.createSpy('width').and.callFake(function(testString) {
        testString = 200;
        return testString;
      });
      return mockWindow;
    });

    ctrl.inviteesList = [
      {email: 'test', valid: false},
      {email: 'test@us.ibm.com', valid: true},
      {email: 'anotherUser@us.ibm.com', valid: true},
      {email: 'wrongemail', valid: false}
    ];

    ctrl.removeInvitee('test@us.ibm.com', false);

    expect(ctrl.inviteesList).toEqual([
      {email: 'test', valid: false},
      {email: 'anotherUser@us.ibm.com', valid: true},
      {email: 'wrongemail', valid: false}
    ]);
    $timeout.flush();

    spy.and.callThrough();
  });

  it('should remove invitee when only one exists', function() {
    var spy = spyOn(document, 'querySelector').and.callFake(function() {
      return {
        style: {
          width: ''
        }
      };
    });

    ctrl.inviteesList = [
      {email: 'test@us.ibm.com', valid: true}
    ];

    ctrl.removeInvitee('test@us.ibm.com', false);

    expect(ctrl.inviteesList).toEqual([
      {
        email: '',
        focused: '',
        newEmail: '',
        valid: false
      }
    ]);
    $timeout.flush();

    spy.and.callThrough();
  });

  it('should not create a new invitee on invalid email', function() {
    var mockWindow;
    var spy;

    spy = spyOn(angular, 'element').and.callFake(function () {
      mockWindow = jasmine.createSpy('windowElement');
      mockWindow.width = jasmine.createSpy('width').and.callFake(function(testString) {
        testString = 200;
        return testString;
      });
      return mockWindow;
    });

    ctrl.inviteesList = [
      {email: 'test', valid: false},
      {email: 'test@us.ibm.com', valid: true},
      {email: 'anotherUser@us.ibm.com', valid: true},
      {email: 'wrongemail', valid: false}
    ];

    ctrl.createNewInvitee(3, 'invalid-email');
    $timeout.flush();
    spy.and.callThrough();
  });

  it('should create a new invitee on valid email', function() {
    var mockWindow;
    var spy;

    spy = spyOn(angular, 'element').and.callFake(function () {
      mockWindow = jasmine.createSpy('windowElement');
      mockWindow.width = jasmine.createSpy('width').and.callFake(function(testString) {
        testString = 200;
        return testString;
      });
      return mockWindow;
    });

    ctrl.inviteesList = [
      {email: 'test', valid: false},
      {email: 'test@us.ibm.com', valid: true},
      {email: 'anotherUser@us.ibm.com', valid: true},
      {email: 'wrongemail', valid: false}
    ];

    ctrl.createNewInvitee(3, 'test4@us.ibm.com');
    $timeout.flush();
    spy.and.callThrough();
  });

  it('should not create first invitee on empty/invalid email', function() {
    var spy = spyOn(document, 'querySelector').and.callFake(function() {
      return {
        style: {
          width: ''
        }
      };
    });

    ctrl.inviteesList = [
      {email: '', valid: false}
    ];

    ctrl.createNewInvitee(0, '');
    $timeout.flush();
    spy.and.callThrough();
  });

  it('should create the first new invitee on valid email', function() {
      var mockWindow;
      var spy;

      spy = spyOn(angular, 'element').and.callFake(function () {
        mockWindow = jasmine.createSpy('windowElement');
        mockWindow.width = jasmine.createSpy('width').and.callFake(function(testString) {
          testString = 200;
          return testString;
        });
        return mockWindow;
      });

      ctrl.inviteesList = [
        {email: '', valid: false}
      ];

      ctrl.createNewInvitee(0, 'testemail1@us.ibm.com');
      $timeout.flush();
      spy.and.callThrough();
    });

  it('should clear all invitees', function() {
    var spy = spyOn(document, 'querySelector').and.callFake(function() {
      return {
        style: {
          width: ''
        }
      };
    });

    ctrl.removeInvitee(false, true);
    $timeout.flush();
    spy.and.callThrough();
  });

});
