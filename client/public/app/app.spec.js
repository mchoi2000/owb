//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
describe('public app', function() {

  beforeEach(module('public', function($provide) {
    $provide.value('public.sorry', {id: 'sorry'});
    $provide.value('public.landing', {id: 'landing'});
  }));

  beforeEach(inject());

  it('should load modules', function() {

  });

});
