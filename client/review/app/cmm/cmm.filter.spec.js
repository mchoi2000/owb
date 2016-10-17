//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('CMM review page filter', function() {

  beforeEach(module('review.cmm'));

  it('should have a groupBy filter', inject(function($filter) {
    expect($filter('groupBy')).not.toBeNull();
  }));

  it('should return grouped list',
  inject(function($filter) {
    var list = [
      {area: 'area 1', IOT: 'IOT 1'},
      {area: 'area 1', IOT: 'IOT 1'},
      {area: 'area 1', IOT: 'IOT 1'},
      {area: 'area 2', IOT: 'IOT 2'},
      {area: 'area 2', IOT: 'IOT 2'},
      {area: 'area 3', IOT: 'IOT 3'}
    ];
    var groupedList = [{
      label: 'IOT 1',
      group: [
        {area: 'area 1', IOT: 'IOT 1'},
        {area: 'area 1', IOT: 'IOT 1'},
        {area: 'area 1', IOT: 'IOT 1'}
      ]
    }, {
      label: 'IOT 2',
      group: [
        {area: 'area 2', IOT: 'IOT 2'},
        {area: 'area 2', IOT: 'IOT 2'}
      ]
    }, {
      label: 'IOT 3',
      group: [{area: 'area 3', IOT: 'IOT 3'}]
    }];
    expect($filter('groupBy')(list, 'IOT')).toEqual(groupedList);
  }));
});
