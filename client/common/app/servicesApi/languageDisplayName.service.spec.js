'use strict';

describe('Language Display Name service', function() {
  var langDisplayName;

  beforeEach(module('common.languageDisplayName', function($provide) {

    var mockBlackListCountryService = {
      getAllCountries: function() {
        var res = {
          data: [
            {'name': 'Country1', 'code': 'AA'},
            {'name': 'Country2', 'code': 'B'},
            {'name': 'Japan', 'code': 'JP'},
            {'name': 'United States', 'code': 'us'}
            ]
        };
        return ({
          then: function(callback) {
            callback(res);
          }
        });
      }
    };

    var mockLanguages = [
      {'display': 'ALanguage', 'value': 'aa'},
      {'display': 'BLanguage', 'value': 'bb'},
      {'display': 'Japanese', 'value': 'ja'},
      {'display': 'English', 'value': 'en'}
    ];

    $provide.value('BlackListCountriesService', mockBlackListCountryService);
    $provide.value('languages', mockLanguages);

  }));

  beforeEach(inject(function(LanguageDisplayName) {
    langDisplayName = LanguageDisplayName;
  }));

  it('should get only the language as display name', function() {
    var displayName = langDisplayName.getDisplayName({
      language: 'aa', country:'aa'
    });
    expect(displayName).toEqual('ALanguage');
  });

  it('should get combination of language and country as display name', function() {
    var displayName = langDisplayName.getDisplayName({
      language: 'bb', country:'b'
    });
    expect(displayName).toEqual('BLanguage (Country2)');
  });

  it('should get combination of language and country code as display name', function() {
    try {
      langDisplayName.getDisplayName({
        language: 'bb', country:'Unrecognized Country Code'
      });
    } catch (e) {
      expect(e.name).toEqual('Locale Error');
      expect(e.message).toEqual('Could not recognize country code');
    }
  });

  it('should get combination of language code and country as display name', function() {
    try {
      langDisplayName.getDisplayName({
        language: 'Unrecognized Language Code', country:'b'
      });
    } catch (e) {
      expect(e.name).toEqual('Locale Error');
      expect(e.message).toEqual('Could not recognize language code');
    }
  });

  it('should get combination of language code and country code as display name', function() {
    try {
      langDisplayName.getDisplayName({
        language: 'Unrecognized Language Code', country:'Unrecognized Country Code'
      });
    } catch (e) {
      expect(e.name).toEqual('Locale Error');
      expect(e.message).toEqual('Could not recognize language code');
    }
  });

  it('should return Japanese for Japan', function() {
    var displayName = langDisplayName.getDisplayName({
      language: 'ja', country:'JP'
    });
    expect(displayName).toEqual('Japanese');
  });

  it('should return English for us locale', function() {
    var displayName = langDisplayName.getDisplayName({
      language: 'en', country:'us'
    });
    expect(displayName).toEqual('English');
  });
});
