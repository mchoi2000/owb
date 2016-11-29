//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('review app', function() {

  beforeEach(module('review', function($provide) {
    $provide.value('review.cmmDir', {id: ''});
    $provide.value('review.cmm', {id: ''});
  }));

  beforeEach(inject());

  it('should load modules', function() {

  });

});
