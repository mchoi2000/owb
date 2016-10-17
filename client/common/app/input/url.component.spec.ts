'use strict';

describe('Url Input Directive', function() {
  var compile, scope, element, httpBackend;

  beforeEach(angular.mock.module('common.input', 'common/app/input/url.html'));

  beforeEach(inject(function($injector, $httpBackend, $compile, $rootScope) {
    compile = $compile;
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    scope.model = '';
    element = angular.element('<form><pwb-url-input ' +
                                'model="model" ' +
                                'label="test" ' +
                                'require-ibm-domain="false" ' +
                                'input-id="test" ' +
                                'input-name="test">' +
                              '</pwb-url-input></form>');

    compile(element)(scope);

    scope.$digest();

  }));

  it('should create a url input directive and reject the url', function() {
    var directiveScope = element.find('pwb-url-input').isolateScope();
    directiveScope.$ctrl.model = 'ftp://test.com';
    directiveScope.$ctrl.isValidUrl();
    expect(directiveScope.$ctrl.formCtrl.test.$invalid).toBe(true);
  });

  it('should accept a empty url', function() {
    var directiveScope = element.find('pwb-url-input').isolateScope();
    directiveScope.$ctrl.model = '';
    directiveScope.$ctrl.isValidUrl();
  });

  it('should create a url input directive and accept the url', function() {
    var directiveScope = element.find('pwb-url-input').isolateScope();

    httpBackend.when('POST', 'api/url').respond(200);
    directiveScope.$ctrl.model = 'http://google.com';
    directiveScope.$ctrl.isValidUrl();

    httpBackend.flush();
    expect(directiveScope.$ctrl.formCtrl.test.$invalid).toBe(false);
  });

  it('url should be rejected from service', function() {
    var directiveScope = element.find('pwb-url-input').isolateScope();

    httpBackend.when('POST', 'api/url').respond(500);
    directiveScope.$ctrl.model = 'http://fsdfsdf.com';
    directiveScope.$ctrl.isValidUrl('http://fsdfsdf.com');

    httpBackend.flush();
    expect(directiveScope.$ctrl.formCtrl.test.$invalid).toBe(true);
  });

  it('url test a valid ibm.com specific URL and append http:// to the url', function() {
    var directiveScope = element.find('pwb-url-input').isolateScope();

    directiveScope.$ctrl.requireDomain = true;
    var youtubePattern = /youtube\.com$/;
    var youtubePatternTwo = /youtu\.be$/;
    directiveScope.$ctrl.domain = [youtubePattern, youtubePatternTwo];

    directiveScope.$ctrl.model = 'youtube.com';
    directiveScope.$ctrl.isValidUrl('youtube.com');
  });

  it('url test a valid ibm.com specific URL and append http:// to the url', function() {
    var directiveScope = element.find('pwb-url-input').isolateScope();

    directiveScope.$ctrl.requireDomain = true;
    var youtubePattern = /youtube\.com$/;
    var youtubePatternTwo = /youtu\.be$/;
    directiveScope.$ctrl.domain = [youtubePattern, youtubePatternTwo];

    directiveScope.$ctrl.model = 'youtu.be/test';
    directiveScope.$ctrl.isValidUrl('youtu.be/test');
  });

  it('url test an invalid ibm.com specific URL', function() {
    var directiveScope = element.children().isolateScope();

    directiveScope.$ctrl.requireDomain = true;
    var youtubePattern = /youtube\.com$/;
    var youtubePatternTwo = /youtu\.be$/;
    directiveScope.$ctrl.domain = [youtubePattern, youtubePatternTwo];
    directiveScope.$ctrl.model = 'http://notibmurl.com';
    directiveScope.$ctrl.isValidUrl('http://notibmurl.com');

    expect(directiveScope.$ctrl.formCtrl.test.$invalid).toBeTruthy();
  });
});
