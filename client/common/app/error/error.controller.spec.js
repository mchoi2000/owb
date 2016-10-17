//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

describe('ErrorControllerTest', function() {
  beforeEach(module('common.error'));

  var $controller;
  var $window = {
    location: {
      replace: function() {}
    }
  };

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
    spyOn($window.location, 'replace').and.callThrough();
    $controller('errorController', {$window : $window});
  }));

  it('should route to home/error', function() {
    expect($window.location.replace).toHaveBeenCalledWith('home/error');
  });

});
