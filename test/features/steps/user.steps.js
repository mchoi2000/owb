'use strict';

// jshint unused:false
const should = require('should');

module.exports = function () {

  this.Given(/^I am a ([\w]*)$/, function (role) {
    return this.usersDB.get(this.testUser._id)
      .catch(() => this.testUser)
      .then(user => {
        user.roles.push(role);
        return this.usersDB.put(user);
      });
  });

  this.Given(/^I am registered$/, function () {
    return this.usersDB.get(this.testUser._id)
      .catch(() => this.testUser)
      .then(user => {
        user.registered = true;
        user.PWBPlatform = true;
        return this.usersDB.put(user);
      });
  });

  this.Given(/^I have a product$/, function () {
    let userPromise = this.usersDB.get(this.testUser._id)
      .catch(() => this.testUser)
      .then(user => {
        user.products.push(this.testProduct._id);
        return this.usersDB.put(user);
      });

    let productPromise = this.productsDB.get(this.testProduct._id)
      .catch(() => this.testProduct)
      .then(product => {
        product.offeringData.owner = this.testUser._id;
        return this.productsDB.put(product);
      });

    return Promise.all([userPromise, productPromise]);
  });

  this.Given(/^Another user has a product$/, function() {
    let userPromise = this.usersDB.get(this.otherUser._id)
      .catch(() => this.otherUser)
      .then(user => {
        user.products.push(this.testProduct._id);
        return this.usersDB.put(user);
      });

    let productPromise = this.productsDB.get(this.testProduct._id)
      .catch(() => this.testProduct)
      .then(product => {
        product.offeringData.owner = this.otherUser._id;
        return this.productsDB.put(product);
      });

    return Promise.all([userPromise, productPromise]);
  });

  this.Given(/^I have a cognitive product$/, function () {
    let userPromise = this.usersDB.get(this.testUser._id)
      .catch(() => this.testUser)
      .then(user => {
        user.products.push(this.testProduct._id);
        return this.usersDB.put(user);
      });

    let productPromise = this.productsDB.get(this.testProduct._id)
      .catch(() => this.testProduct)
      .then(product => {
        product.offeringData.owner = this.testUser._id;
        product.type = 'Cognitive Application';
        product.contactPerson = {
          firstName: 'Spintax',
          lastName: 'The Green',
          email: ''
        };
        delete product.integration;
        delete product.cmc;
        delete product.offeringManager;
        delete product.marketingManager;
        return this.productsDB.put(product);
      });

    return Promise.all([userPromise, productPromise]);
  });

  this.Given(/^a registered user has a product$/, function() {
    let userPromise = this.usersDB.get(this.otherUser._id)
      .catch(() => this.otherUser)
      .then(user => {
        user.products.push(this.testProduct._id);
        return this.usersDB.put(user);
      });

    let productPromise = this.productsDB.get(this.testProduct._id)
      .catch(() => this.testProduct)
      .then(product => {
        product.offeringData.owner = this.otherUser._id;
        return this.productsDB.put(product);
      });

    return Promise.all([userPromise, productPromise]);
  });

  this.Given(/^another provider is registered$/, function () {
    return this.usersDB.get(this.otherUser._id)
      .catch(() => this.otherUser)
      .then(user => {
        return this.usersDB.put(user);
      });
  });

  this.Given(/^a registered provider is an editor$/, function() {
    let userPromise = this.usersDB.get(this.otherUser._id)
      .catch(() => this.otherUser)
      .then(user => {
        user.products.push(this.testProduct._id);
        return this.usersDB.put(user);
      });

    let productPromise = this.productsDB.get(this.testProduct._id)
      .catch(() => this.testProduct)
      .then(product => {
        product.offeringData.editors.push(this.otherUser._id);
        return this.productsDB.put(product);
      });

    return Promise.all([userPromise, productPromise]);
  });

  this.Given(/^an unregistered provider is invited$/, function() {
    let invitedPromise = this.invitedDB.get(this.unregistered)
      .catch(() => this.invitedDB.put({
        _id: this.unregistered,
        products: [this.testProduct._id],
        PWBPlatform: true,
        lastSentAt: Date.now() / 1000
      }));

    let productPromise = this.productsDB.get(this.testProduct._id)
      .catch(() => this.testProduct)
      .then(product => {
        product.offeringData.invitedUsers.push(this.unregistered);
        return this.productsDB.put(product);
      });

    return Promise.all([invitedPromise, productPromise]);
  });

  this.Given(/^I am invited to a product$/, function() {
    return this.invitedDB.get(this.testUser.email)
      .catch(() => this.invitedDB.put({
        _id: this.testUser.email,
        products: [this.testProduct._id],
        PWBPlatform: true,
        lastSentAt: Date.now() / 1000
      }));
  });

  this.Then(/^a registered provider can edit product$/, function() {
    return Promise.all([this.usersDB.get(this.otherUser._id),
                        this.productsDB.get(this.testProduct._id)])
      .then(results => {
        let user = results[0];
        let product = results[1];
        user.products.length.should.equal(1);
        user.products[0].should.equal(product._id);
        product.offeringData.editors.length.should.equal(1);
        product.offeringData.editors[0].should.equal(user._id);
      });
  });

  this.Then(/^an unregistered provider is invited to product$/, function() {
    return Promise.all([this.productsDB.get(this.testProduct._id),
                        this.invitedDB.get(this.unregistered)])
      .then(results => {
        let product = results[0];
        let invited = results[1];
        product.offeringData.invitedUsers.length.should.equal(1);
        product.offeringData.invitedUsers[0].email.should.equal(this.unregistered);
        invited._id.should.equal(this.unregistered);
        invited.products.length.should.equal(1);
        invited.products[0].should.equal(product._id);
      });
  });

  this.Then(/^a registered provider cannot edit a product$/, function() {
    return Promise.all([this.usersDB.get(this.otherUser._id),
                        this.productsDB.get(this.testProduct._id)])
      .then(results => {
        let user = results[0];
        let product = results[1];
        user.products.length.should.equal(0);
        product.offeringData.editors.length.should.equal(0);
      });
  });

  this.Then(/^an unregistered provider is not invited$/, function() {
    return this.productsDB.get(this.testProduct._id)
      .then(product => {
        product.offeringData.invitedUsers.length.should.equal(0);
        return this.invitedDB.get(this.unregistered);
      })
      .catch(() => {});
  });

  this.Then(/^a registered provider is an owner$/, function() {
    return Promise.all([this.usersDB.get(this.otherUser._id),
                        this.productsDB.get(this.testProduct._id)])
      .then(results => {
        let user = results[0];
        let product = results[1];
        user.products.length.should.equal(1);
        user.products[0].should.equal(product._id);
      });
  });

  this.Then(/^I am an editor of a product$/, function() {
    return Promise.all([this.usersDB.get(this.testUser._id),
                        this.productsDB.get(this.testProduct._id)])
      .then(results => {
        let user = results[0];
        let product = results[1];
        user.products.length.should.equal(1);
        user.products[0].should.equal(product._id);
        product.offeringData.editors.length.should.equal(1);
      });
  });
};
