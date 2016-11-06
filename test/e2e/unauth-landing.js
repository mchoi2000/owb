//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
/*global
browser: false
*/
'use strict';

describe('Workbench landing page', function() {
  beforeEach(function() {
    browser.get('index.html');
    browser.waitForAngular();
  });

  it('title should be right', function() {
    expect(browser.getTitle())
      .toEqual('Provider Workbench Home');
  });

});
