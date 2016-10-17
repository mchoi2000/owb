//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

(function() {
    angular.module('common.spinner').component('loader', {
        templateUrl: 'common/app/spinner/spinner.html',
        bindings: {
            loading: '='
        }
    });
})();
