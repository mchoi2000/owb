//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function () {
  'use strict';

  angular.module('common.collab').controller('CollaborateModalController', [
    '$http',
    '$window',
    '$timeout',
    '$uibModalInstance',
    'UserService',
    'ProductsFactory',
    'modalData',
    mCController
  ]);

  function mCController($http, $window, $timeout, $uibModalInstance, UserService, ProductsFactory,
    modalData) {
    /* jshint validthis: true */
    var i;
    var _this = this;
    var copyProductOwner = modalData.product.offeringData.owner;
    var maxRowLength = 648;

    _this.initialize = initialize;
    _this.currentTime = new Date();
    _this.inviteUsersFocus = false;

    function initialize() {
      //Basic Initialization
      _this.loadingPage = false;
      _this.resentClicked = false;
      _this.invitedUsersList = [];
      _this.maxEmailLength = 20;
      _this.product = modalData.product;

      //Remove Editor - Initialization
      _this.editorsToRemove = [];
      _this.lastUserRemoved = false;
      _this.lastUserRemoveUndo = false;

      //Change Owner - Initialization
      _this.newOwner = false;

      for (var i = 0; i < _this.product.offeringData.invitedUsers.length; i++) {
        var dateString = new Date().toLocaleString(
          _this.product.offeringData.invitedUsers[i].lastSentAt);
        dateString = dateString.split(',');
        _this.invitedUsersList.push({
          email: _this.product.offeringData.invitedUsers[i].email,
          lastSent: dateString[0],
          invitedBy: _this.product.offeringData.invitedUsers[i].invitedBy,
          resentAt: ''
        });
      }

      _this.confirmChange = {
        changeOwner:false
      };
      _this.currentUser = modalData.currentUser;

      UserService.getUser(modalData.product.offeringData.owner)
        .then(function userServiceGetUserCallback(userData) {
          _this.productOwner = userData;
          _this.notOwner = _this.currentUser.email !== _this.productOwner.email;
        });

      _this.editors = [];
      for (i = 0; i < modalData.product.offeringData.editors.length; i++) {
        UserService.getUser(modalData.product.offeringData.editors[i])
          .then(function userServiceGetUserCallback(userData) {
            _this.editors.push(userData);
          });
      }
    }

    function changeOwner(newOwner) {
      //DB update called from function saveChange().
      if (newOwner) {
        _this.product.offeringData.owner = newOwner;
        _this.newOwner = newOwner;
      }
      _this.confirmChange.changeOwner = true;
    }

    function removeEditor(editorID) {
      _this.editorsToRemove.push(editorID);
      _this.lastUserRemoved = editorID;
      _this.confirmChange.removeEditor = true;
    }

    function undoRemoveEditor(editorID) {
      _this.editorsToRemove.splice(_this.editorsToRemove.indexOf(editorID), 1);
      _this.confirmChange.removeEditor = _this.editorsToRemove.length > 0;
      _this.lastUserRemoveUndo = editorID;
    }

    _this.inviteesInputWidth = '100%';
    _this.lastUserEmailInvited = 'No emails invited yet';
    _this.allValidEmails = true;

    // To activate the NG repeat - there is one empty invitee
    _this.inviteesList = [
      {
        email: '',
        focused: '',
        newEmail: '',
        valid: false
      }
    ];

    $timeout(function timeoutCallback() {
      _this.updateInviteesInputWidth((_this.inviteesList.length - 1), false, false);
    }, 0);

    function updateInviteesInputWidth(index, email, event) {
      // If a comma or semicolon have not been pressed
      if (event.keyCode !== 59 && event.keyCode !== 188 && event.keyCode !== 186) {
        // If there is only one invitee that is empty
        if (_this.inviteesList.length === 1 && _this.inviteesList[0].email === '') {
          _this.inviteesList[0].valid = checkValidIBMEmail(_this.inviteesList[0].email);

          _this.inviteesInputWidth = maxRowLength - 10;

          document.querySelector('#invitees_input_field_' + index)
            .style.width = _this.inviteesInputWidth + 'px';
        }
        // If there is more than one invitee
        else {
          //Update the currently typed in field's width to the width of its companion div
          _this.inviteesInputWidth = angular.element(document
            .querySelector('#invitees_input_text_display_' + index)).width() + 12;

          angular.element(document
            .querySelector('#invitees_input_field_' + index)).width(_this.inviteesInputWidth);

          //Resize the remaining input fields
          _this.resizeInputFields(index);
        }
      } else {
        // If a comma or semi colon was pressed, then add a new item to the invitee list
        event.preventDefault();
        _this.createNewInvitee(index, email);
      }
    }

    function resizeInputFields(index) {
      var rowLength = 0;
      var rowNumLength = 0;

      for (var i = 0; i < _this.inviteesList.length; i++) {

        if (_this.inviteesList[i].newEmail === '') {
          angular.element(document
            .querySelector('#invitees_input_field_' + i)).width(8);
        }

        // Check if the email is valid and this var sets invalid styling in the view
        _this.inviteesList[i].valid = _this.checkValidIBMEmail(_this.inviteesList[i].email);

        // Row length check for buttons
        rowNumLength += angular.element(document
          .querySelector('#existing_invite_' + i)).width() + 30;

        if (rowNumLength < maxRowLength) {
          rowLength += angular.element(document
            .querySelector('#existing_invite_' + i)).width() + 30;
        } else {
          if ((i - 1) === index) {
            // This stops the currently selected input field from being expended
            angular.element(document.querySelector('#invitees_input_field_' + (i - 1)))
              .width(_this.inviteesInputWidth);
          } else {
            // This extends the previous input field to the remainder of the width of the previous row
            angular.element(document.querySelector('#invitees_input_field_' + (i - 1)))
              .width(maxRowLength - rowLength + 5);
          }

          rowLength = 0;
          rowNumLength = 0;
          rowLength += angular.element(document
            .querySelector('#existing_invite_' + i)).width() + 30;
          rowNumLength += angular.element(document
            .querySelector('#existing_invite_' + i)).width() + 30;
        }

        // Row length check for input fields
        rowNumLength += angular.element(document
          .querySelector('#invitee_item_container_' + i)).width();

        if (rowNumLength < maxRowLength) {
          rowLength += angular.element(document
            .querySelector('#invitee_item_container_' + i)).width();
        } else {
          rowLength = 0;
          rowNumLength = 0;

          rowLength += angular.element(document
            .querySelector('#invitee_item_container_' + i)).width();
          rowNumLength += angular.element(document
            .querySelector('#invitee_item_container_' + i)).width();
        }

        // Extend the input field from the previous row to the remaining length
        if (i === _this.inviteesList.length - 1 && i !== index ||
            i === _this.inviteesList.length - 1 && _this.inviteesList[i].newEmail === '') {
          angular.element(document.querySelector('#invitees_input_field_' + i))
            .width((maxRowLength) - rowLength + 5);
        }
        // If the last input field is selected and has been typed in, don't extend
        else {
          angular.element(document
            .querySelector('#invitees_input_field_' + _this.inviteesList.length - 1))
            .width(_this.inviteesInputWidth);
        }
      }
    }

    function createNewInvitee(index, email) {
      var newInvitee = {
        email: email.replace(/,/g, '').replace(/;/g, ''),
        focused: true,
        newEmail: '',
        valid: false
      };

      if (newInvitee.email !== '') {
        _this.inviteesList[index].newEmail = '';

        newInvitee.valid = _this.checkValidIBMEmail(newInvitee.email);

        if (newInvitee.valid) {
          _this.lastUserEmailInvited = newInvitee.email +
            ' added - Press send below when done adding emails to invite';
        }
        if (_this.inviteesList.length === 1 && _this.inviteesList[0].email === '') {
          _this.inviteesList[0].email = newInvitee.email;
          _this.inviteesList[0].valid = newInvitee.valid;
        } else {
          _this.inviteesList.splice((index + 1), 0, newInvitee);
        }
        // Run the updateInviteesInputWidth to update the new list with the current index
        $timeout(function timeoutCallback() {
          _this.updateInviteesInputWidth(index, false, false);
        }, 0);
      }
      else {
        _this.inviteesList[index].newEmail = '';
        // Run the updateInviteesInputWidth to update the new list with the last item
        $timeout(function timeoutCallback() {
          _this.updateInviteesInputWidth((_this.inviteesList.length - 1), false, false);
        }, 0);
      }

      _this.allValidEmails = _this.checkValidEmailAll();

    }

    function checkValidIBMEmail(email) {
      var returnValue = false;
      if (validator.isEmail(email)) {
        if (email.match('@ibm\.com' + '$') || email.match('@..\.ibm\.com' + '$')) {
          returnValue = true;
        }
      }
      return returnValue;
    }

    _this.checkValidEmailAll = checkValidEmailAll;
    function checkValidEmailAll () {
      for (var i = 0; i < _this.inviteesList.length; i++) {
        if (_this.inviteesList[i].valid === false) {
          return false;
        }
      }
      return true;
    }

    function removeInvitee(inviteeEmail, clearAllInvitees) {
      if (_this.inviteesList.length > 1 && !clearAllInvitees) {
        for (var i = 0; i < _this.inviteesList.length; i++) {
          if (inviteeEmail === _this.inviteesList[i].email) {
            _this.inviteesList.splice(i, 1);
          }
        }
      } else {
        _this.inviteesList = [
          {
            email: '',
            focused: '',
            newEmail: '',
            valid: false
          }
        ];
        _this.inviteUsersFocus = false;
      }

      _this.allValidEmails = _this.checkValidEmailAll();

      $timeout(function timeoutCallback() {
        _this.updateInviteesInputWidth((_this.inviteesList.length - 1), false, false);
      }, 0);
    }

    function sendInvitations(inviteesList) {
      /*
      Perform validations on the invitees(remove white spaces, check if email is valid).
      Call API to send invitataions.
      */

      var validEmails = [];
      var invalidEmails = [];

      for (var i = 0; i < inviteesList.length; i++) {
        if (inviteesList[i].valid) {
          validEmails.push(inviteesList[i].email);
          _this.invitedUsersList.push({
            email: inviteesList[i].email,
            lastSent: ''
          });
        } else {
          invalidEmails.push(inviteesList[i].email);
        }
      }

      _this.inviteesList = [
        {
          email: '',
          focused: '',
          newEmail: '',
          valid: false
        }
      ];

      // This has been kept temporarily incase we ever need to do something with
      // invalid emails. Right now, they are simply ignored after being stored.
      if (invalidEmails.length > 0) {
        var invalidEmailText = '';
        invalidEmails.forEach(function invalidEmailsForEachCallback(email) {
          invalidEmailText += email + '\n';
        });
      }

      UserService.inviteUser({
        invitationList: validEmails,
        productId: _this.product._id
      }).then(function inviteSuccess(data) {
        reloadModal();
      });

      _this.inviteUsersFocus = false;
      _this.removeInvitee(false, true);
      _this.loadingPage = false;
    }

    function resendInvite(invitedUserEmail) {
      _this.resentClicked = true;
      _this.currentTime = new Date();

      $http.put('api/products/resendInvite', {
        productId: _this.product._id,
        editorId: invitedUserEmail
      });

      for (var i = 0; i < _this.invitedUsersList.length; i++) {
        if (_this.invitedUsersList[i].email === invitedUserEmail) {
          var timeNow = new Date();
          _this.invitedUsersList[i].resentAt = timeNow;
          _this.invitedUsersList[i].lastSent = timeNow;
        }
      }
    }

    function saveChange() {
      if (_this.confirmChange.removeEditor) {
        UserService.removeUsers({productId: _this.product._id, editorIds: _this.editorsToRemove})
          .then(function successCallback(response) {
            //If editor removed himself/herself from the product then close the modal.
            if (_this.currentUser.email !== _this.productOwner.email) {
              $uibModalInstance.close({changed:true});
            } else {
              reloadModal();
            }
          }, function errorCallback(data) {
            $uibModalInstance.close({changed:true});
          });
        _this.confirmChange.removeEditor = false;
      }

      if (_this.confirmChange.changeOwner) {
        _this.loadingPage = false;
        $http.put('api/products/changeOwner', {
          productId: _this.product._id,
          currentOwnerId: _this.currentUser._id,
          newOwnerId: _this.product.offeringData.owner
        }).then(function successCallback(response) {
            reloadModal();
          }, function errorCallback(response) {
            _this.loadingPage = false;
            $uibModalInstance.close({changed:true});
          });
        _this.confirmChange.changeOwner = false;
      }
    }

    function reloadModal() {
      _this.loadingPage = true;
      ProductsFactory.getProduct(_this.product._id).then(function getQualificationSuccess(data) {
        modalData.product = data.data;
        _this.initialize();
        _this.loadingPage = false;
      }, function getQualificationError(data) {
        _this.loadingPage = false;
        $uibModalInstance.close({changed:true});
      });
    }

    function cancelChange() {
      if (_this.confirmChange.changeOwner === true) {
        _this.product.offeringData.owner  = copyProductOwner;
        _this.confirmChange.changeOwner = false;
      }
      _this.editorsToRemove = [];
      _this.lastUserEmailInvited = 'All changes canceled';
      _this.confirmChange.removeEditor = false;
    }

    function closeModal() {
      $uibModalInstance.close({changed:true});
    }

    _this.initializeFunctionNames = initializeFunctionNames;
    function initializeFunctionNames() {
      _this.changeOwner = changeOwner;
      _this.removeEditor = removeEditor;
      _this.undoRemoveEditor = undoRemoveEditor;
      _this.updateInviteesInputWidth = updateInviteesInputWidth;
      _this.resizeInputFields = resizeInputFields;
      _this.createNewInvitee = createNewInvitee;
      _this.checkValidIBMEmail = checkValidIBMEmail;
      _this.removeInvitee = removeInvitee;
      _this.sendInvitations = sendInvitations;
      _this.resendInvite = resendInvite;
      _this.saveChange = saveChange;
      _this.cancelChange = cancelChange;
      _this.closeModal = closeModal;
    }

    _this.initializeFunctionNames();
    _this.initialize();
  }
})();
