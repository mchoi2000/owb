//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('review app', function() {

  beforeEach(module('review', function($provide) {
    $provide.value('review.qualification', {id: ''});
    $provide.value('review.qualificationDash', {id: ''});
    $provide.value('review.content', {id: ''});
    $provide.value('review.contentDash', {id: ''});
    $provide.value('review.commerce', {id: ''});
    $provide.value('review.commerceDash', {id: ''});
    $provide.value('review.commerceSpecialistDash', {id: ''});
    $provide.value('review.cmmDash', {id: ''});
    $provide.value('review.cmm', {id: ''});
  }));

  beforeEach(inject());

  it('should load modules', function() {

  });

});
