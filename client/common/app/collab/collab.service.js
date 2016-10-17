//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function () {
  'use strict';

  angular.module('common.collab').factory('CollabService', ['$uibModal', service]);

  function service($uibModal) {
    var service = {
      openModal: openModal
    };

    return service;

    function openModal(product, user) {
      return $uibModal.open({
        templateUrl: 'common/app/collab/collaborateModalPartial.html',
        controller: 'CollaborateModalController',
        controllerAs: 'ctrlCM',
        backdrop: 'static',
        windowClass: 'participant_modal',
        resolve: {
          modalData: {
            product: product,
            currentUser: user
          }
        }
      });
    }
  }
})();
