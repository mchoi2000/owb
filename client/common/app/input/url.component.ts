//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  class UrlInputController {

    static $inject = ['$http'];

    urlPattern: any = /^(?:(http|https):\/\/)?((?:[\w-]+\.)+[a-z]{2,5})(?::[0-9]{1,5})?(?:\/.*)?$/;
    formCtrl: any;
    inputName: any;
    model: any;
    requireDomain: any;
    domain: any;

    constructor(private $http: any) {
    }

    isValidUrl() {
      var url = this.model;
      if (url === '' || url === undefined) {
        this.formCtrl[this.inputName].$setValidity('validUrl', true);
        this.formCtrl[this.inputName].$setValidity('validDomain', true);
        return;
      }

      var match = this.urlPattern.exec(url);
      if (!match) {
        this.formCtrl[this.inputName].$setValidity('validUrl', false);
        return;
      }

      if (this.requireDomain) {
        var validDomain = false;
        for (var i = 0; i < this.domain.length; i++) {
          if (this.domain[i].test(match[2])) {
            validDomain = true;
            break;
          }
        }
        this.formCtrl[this.inputName].$setValidity('validDomain', validDomain);
        this.formCtrl[this.inputName].$setValidity('validUrl', true);
        return;
      }
      return this.liveUrlCheck(url)
          .then(() => {
            this.formCtrl[this.inputName].$setValidity('validUrl', true);
            this.formCtrl[this.inputName].$setValidity('validDomain', true);
          })
          .catch(() => {
            this.formCtrl[this.inputName].$setValidity('validUrl', false);
            this.formCtrl[this.inputName].$setValidity('validDomain', false);
          });
    }

    liveUrlCheck(url) {
      var body = {
        url: url
      };

      return this.$http({
        method: 'POST',
        url: 'api/url',
        data: body
      });
    }

  }

  angular.module('common.input').component('pwbUrlInput', {
    controller: UrlInputController,
    templateUrl: 'common/app/input/url.html',
    bindings: {
      inputId: '@',
      inputName: '@',
      label: '@',
      description: '@',
      model: '=',
      isRequired: '<?',
      requireDomain: '<?',
      domain: '<?'
    },
    transclude: true,
    require: {
      formCtrl: '^form'
    }
  });

})();
