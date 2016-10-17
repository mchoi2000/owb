//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

var FREE_TRIAL = 'FREE_TRIAL';
var FREE_EDITION = 'FREE_EDITION';
var SELF_SERVICE = 'SELF_SERVICE';
var SALES_SUPPORT = 'SALES_SUPPORT';

var commerceData = {
  types: {
    FREE_TRIAL: FREE_TRIAL,
    FREE_EDITION: FREE_EDITION,
    SELF_SERVICE: SELF_SERVICE,
    SALES_SUPPORT: SALES_SUPPORT
  },
  typeList: [
    {
      display: 'It is a free trial. (limited time, fully functional edition)',
      value: FREE_TRIAL
    },
    {
      display: 'It is a free edition. (unlimited time, partially functional edition)',
      value: FREE_EDITION
    },
    {
      display: 'It is a self-service digital purchase.',
      value: SELF_SERVICE
    },
    {
      display: 'It requires sales support to purchase.',
      value: SALES_SUPPORT
    }
  ],
  reviewTypeMap: {
    FREE_TRIAL: 'Free Trial',
    FREE_EDITION: 'Free Edition',
    SELF_SERVICE: 'Self-Service Digital Purchase',
    SALES_SUPPORT: 'Requires Sales Support'
  },
  lengthList: [
    {name:'30 Days', value:'30 Days'},
    {name:'60 Days', value:'60 Days'},
    {name:'90 Days', value:'90 Days'}
  ],
  sections: [
    {name: 'add_edition', value: 'Add Edition'},
    {name: 'offering_details', value: 'Offering Details'},
    {name: 'submit', value: 'Submit for Review'}
  ],
  reviewSections: [
    {name: 'pricing_table', value: 'Pricing Table'},
    {name: 'approve_return', value: 'Approve or Return'}
  ],
  specReviewSections: [
    {name: 'pricing_table', value: 'Pricing Table'},
    {name: 'part_number_input', value: 'Enter Part Numbers'},
    {name: 'approve_return', value: 'Approve or Return'}
  ]
};

(function() {
  'use strict';

  angular.module('common.data').value('CommerceData', commerceData);

})();
