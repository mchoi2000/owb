//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

var cmmData = {
  sortOptionsList: [
    {name: 'Alphabetical (A-Z)', value: '+offeringName'},
    {name: 'Alphabetical (Z-A)', value: '-offeringName'}
  ],
  statusList: [
    {name:'Awaiting Review by Country Manager', value:'Awaiting Review by Country Manager'},
    {name:'Approved by Country Manager', value:'Approved by Country Manager'},
    {name:'Blacklisted by Country Manager', value:'Blacklisted by Country Manager'},
    {name:'Blacklisted by Offering Provider', value:'Blacklisted by Offering Provider'}
  ],
  languageList: [
    {name:'Chinese Simplified', value:'zh-cn'},
    {name:'Chinese Traditional', value:'zh-tw'},
    {name:'English', value:'en'},
    {name:'French', value:'fr'},
    {name:'French (Canada)', value:'fr-ca'},
    {name:'German', value:'de'},
    {name:'Italian', value:'it'},
    {name:'Japanese', value:'ja'},
    {name:'Korean', value:'ko'},
    {name:'Polish', value:'pl'},
    {name:'Portuguese (Brazil)', value:'pt'},
    {name:'Russian', value:'ru'},
    {name:'Spanish', value:'es'},
    {name:'Spanish (Latin America)', value:'es-la'},
    {name:'Turkish', value:'tr'}
  ],
  countryList: [
    {name:'United States', value:'United States', IOT: 'North America'},
    {name:'Canada', value:'Canada', IOT: 'North America'},
    {name:'France', value:'France', IOT: 'Europe'},
    {name:'Germany', value:'Germany', IOT: 'Europe'},
    {name:'Japan', value:'Japan', IOT: 'Asia'},
    {name:'China', value:'china', IOT: 'Asia'}
  ],
  reasonList1: [
    {name:'Translation issues', value:'Translation issues'},
    {name:'All translations are not available to review',
      value:'All translations are not available to review'},
    {name:'Country support structure', value:'Country support structure'},
    {name:'Digital journey issues in Marketplace', value:'Digital journey issues in Marketplace'},
    {name:'Digital journey issues in O2C/support processes',
      value:'Digital journey issues in O2C/support processes'},
    {name:'Digital journey issues in offering', value:'Digital journey issues in offering'}
  ],
  reasonList2: [
    {name:'Reason 1', value:'Reason 1'},
    {name:'Reason 2', value:'Reason 2'},
    {name:'Reason 3', value:'Reason 3'},
    {name:'Reason 4', value:'Reason 4'},
    {name:'Reason 5', value:'Reason 5'},
    {name:'Reason 6', value:'Reason 6'}
  ]
};

(function() {
  'use strict';

  angular.module('review.cmmDash').value('cmmData', cmmData);

})();
