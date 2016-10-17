//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.data').value('cmmBlacklistReasons', [
    {display: 'Translation Issues', value: 'RGM1'},
    {display: 'All translations are not available to review', value: 'RGM2'},
    {display: 'Country support structure', value: 'RGM3'},
    {display: 'Digital journey issues in marketplace', value: 'RGM4'},
    {display: 'Digital journey issues in O2C/support processes', value: 'RGM5'},
    {display: 'Digital journey issues in offering', value: 'RGM6'}
  ]);

  angular.module('common.data').value('omBlacklistReasons', [
    {
      display: 'Not currently available, will be in future ' +
               '(e.g. offering currently has limited global availability)',
      shortDisplay: 'Not currently available, will be in future',
      value: 'ROM1'
    },
    {
      display: 'Not available, does not meet country support requirements ' +
               '(e.g. offering support does not meet country requirements)',
      shortDisplay: 'Does not meet country support requirements',
      value: 'ROM2'
    },
    {
      display: 'Not available, no marketing/sales support for country ' +
               '(e.g. BU does not provide country marketing/sales support)',
      shortDisplay: 'No marketing/sales support for country',
      value: 'ROM3'
    },
    {
      display: 'Not available, no product/defect support for country ' +
               '(e.g. BU does not support offering for country)',
      shortDisplay: 'No product/defect support for country',
      value: 'ROM4'
    },
    {
      display: 'Not Available, due to regulatory issues ' +
               '(e.g. data privacy, in-country hosting, etc.)',
      shortDisplay: 'Regulatory Issues',
      value: 'ROM5'
    }
  ]);

})();
