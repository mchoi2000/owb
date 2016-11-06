'use strict';

module.exports = function () {

  this.Given(/^I am on the landing page$/, function () {
    return this.browser.visit(this.locationBase);
  });

  this.Given(/^I am on the new qualification page$/, function () {
    return this.browser.visit(this.locationBase + 'qualification');
  });

  this.Given(/^I am on a qualification review page$/, function() {
    return this.browser.visit(this.locationBase + 'review/qualification/' +
                              this.testQualification._id);
  });

  this.Given(/^I am on the returned qualification page$/, function() {
    return this.browser.visit(this.locationBase + 'qualification/' +
                              this.testQualification._id);
  });

  this.Given(/^I am on the content page$/, {timeout: 120 * 1000}, function () {
    return this.browser.visit(this.locationBase + 'provider/content/' + this.testProduct._id);
  });

  this.Given(/^I am on the cognitive content page$/, {timeout: 60 * 1000}, function () {
    return this.browser.visit(this.locationBase + 'provider/content/cognitive/' + this.testProduct._id);
  });

  this.Given(/^I am on a content review page$/, {timeout: 60 * 1000}, function() {
    return this.productsDB.get(this.testProduct._id)
      .then(product => {
        return this.browser.visit(this.locationBase + 'review/content/' +
                                  product._id + '?rev=' + product.wcm.submitRevision);
      });
  });

  this.Given(/^I am on the commerce page$/, function() {
    return this.browser.visit(this.locationBase + 'provider/commerce/' + this.testProduct._id);
  });

  this.Given(/^I am on a commerce review page$/, function() {
    return this.productsDB.get(this.testProduct._id)
      .then(product => {
        return this.browser.visit(this.locationBase + 'review/commerce/' +
                                  product._id + '?rev=' + product.cmc.submitRevision);
      });
  });

  this.Given(/^I am on a commerce specialist review page$/, function() {
    return this.productsDB.get(this.testProduct._id)
      .then(product => {
        return this.browser.visit(this.locationBase + 'review/commerceSpecialist/' +
                                  product._id + '?rev=');
      });
  });

  this.Given(/^I am on the integration page$/, function() {
    return this.productsDB.get(this.testProduct._id)
      .then(product => {
        return this.browser.visit(this.locationBase + 'provider/integration/' + product._id);
      });
  });

  this.Given(/^I visit the provider dashboard$/, function() {
    return this.browser.visit(this.locationBase + 'provider/dashboard');
  });

  this.Then(/^I am on the provider dashboard$/, function () {
    this.browser.assert.success();
    this.browser.assert.url({path: this.webRoot + 'provider/dashboard'});
  });

  this.Then(/^I am on the qualification review dashboard$/, function () {
    this.browser.assert.success();
    this.browser.assert.url({path: this.webRoot + 'review/qualification'});
  });

  this.Then(/^I am on the content review dashboard$/, function () {
    this.browser.assert.success();
    this.browser.assert.url({path: this.webRoot + 'review/content'});
  });

  this.Then(/^I am on the commerce review dashboard$/, function () {
    this.browser.assert.success();
    this.browser.assert.url({path: this.webRoot + 'review/commerce'});
  });

  this.Then(/^I am on the cmm review dashboard$/, function () {
    this.browser.assert.success();
    this.browser.assert.url({path: this.webRoot + 'review/cmm'});
  });

  this.Given(/^I am on the translation page$/, function() {
    return this.browser.visit(this.locationBase + 'translation');
  });

  this.Then(/^I am on the qualification confirmation page$/, function() {
    this.browser.assert.success();
    return this.qualifDB.find({selector: {offeringName: {$exists: true}}})
      .then(results => {
        results.docs.length.should.equal(1);
        this.browser.assert.url({
          path: this.webRoot + 'qualification/confirm/' + results.docs[0]._id
        });
      });
  });

  this.Then(/^I am on the cmm review page$/, function() {
    this.browser.assert.success();
    this.browser.assert.url({path: this.webRoot + 'review/cmm/' + this.testProduct._id});
  });

  this.Given(/^I am on the services page$/, function() {
    return this.browser.visit(this.locationBase + 'admin/access');
  });
};
