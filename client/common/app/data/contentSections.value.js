//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.data').value('contentSections', [
      {name: 'search', value: 'Search and navigation'},
      {name: 'overview', value: 'Overview'},
      {name: 'details', value: 'Details'},
      {name: 'howCustomersUseIt', value: 'How customers use it'},
      {name: 'purchasingInformation', value: 'Purchase'},
      {name: 'resources', value: 'Resources'},
      {name: 'faqs', value: 'Frequently asked questions (FAQs)'},
      {name: 'contactInfo', value: 'Contact IBM info'}
  ]);

  angular.module('common.data').value('contentSectionsCollapse', {
    search: false,
    overview: false,
    details: false,
    howCustomersUseIt: false,
    purchasingInformation: false,
    resources: false,
    faqs: false,
    contactInfo: false,
    blacklisted: false
  });

})();
