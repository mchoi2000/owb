'use strict';

describe('Blacklist Countries List', function() {
  var blacklistService;
  var $httpBackend;

  beforeEach(module('common.countries'));

  beforeEach(inject(function(BlackListCountriesService, _$httpBackend_) {
    blacklistService = BlackListCountriesService;
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', 'api/locales').respond(200,
     [
        {locale: 'locale1', name: 'country1-language1'},
        {locale: 'locale2', name: 'country2-language2'},
        {locale: 'locale3', name: 'country3-language3'}
     ]
    );
  }));

  it('should contain locales', function(done) {

    blacklistService.getLocales().then(function getObj(objArr) {
      done();
    });
    $httpBackend.flush();
  });
});
