//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';

describe('UserInformationTest', function() {

  beforeEach(module('common.userInformation'));

  var userInformation, $window;

  beforeEach(inject(function(UserInformation, _$window_) {
    userInformation = UserInformation;
    $window = _$window_;
  }));

  it('retrieve user browser information', function() {

    var result = userInformation.getUserInformation();
    expect(result).toBeDefined();
  });

  it('should get minor version', function() {

    var mockNavigator = {
      appVersion: 'MSIE'
    };

    $window.navigator = mockNavigator;

    var result = userInformation.getMinorVersion();
    expect(result).toBeDefined();

  });

  it('should not get screen height', function() {

    $window.screen = undefined;

    var result = userInformation.getScreenHeight();
    expect(result).toBe(0);
  });

  it('should not get screen width', function() {
    $window.screen = undefined;

    var result = userInformation.getScreenWidth();
    expect(result).toBe(0);
  });

  it('should not get referrer', function() {

    var result = userInformation.getReferrer('');
    expect(result).toBe('');
  });
});
