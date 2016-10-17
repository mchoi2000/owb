//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.languageDisplayName', ['common.countries', 'common.data'])
  .service('LanguageDisplayName', ['BlackListCountriesService', 'languages', langDisplayName]);

  function langDisplayName(BlackListCountriesService, languages) {

    var displayNameFunctions = {
    };
    var blackListData = {};
    BlackListCountriesService.getAllCountries().then(function(result) {
      blackListData = result.data;
    });

    displayNameFunctions.getDisplayName = getDisplayName;
    function getDisplayName(locale) {
      var countryName = '';
      var languageName = '';
      var language = locale.language.split('-')[0].replace(/\s/g, '');
      var countryCode = locale.country.toLowerCase();

      var findLanguage = languages.filter(function searchLanguageName(displayLangObj) {
        return displayLangObj.value === language;
      });

      if (findLanguage.length > 0 && findLanguage[0].display !== undefined) {
        languageName = findLanguage[0].display;
      } else {
        throw {
          name: 'Locale Error',
          message: 'Could not recognize language code'
        };
      }

      if (countryCode === 'jp' || countryCode === 'us' || countryCode === language) {
        return languageName;
      } else {
        var findCountry = blackListData.filter(function searchCountryName(blacklistObj) {
          return blacklistObj.code.toLowerCase() === locale.country;
        });
        if (findCountry.length > 0 && findCountry[0].name !== undefined) {
          countryName = findCountry[0].name;
        } else {
          throw {
            name: 'Locale Error',
            message: 'Could not recognize country code'
          };
        }
        return languageName + ' (' + countryName + ')';
      }
    }

    return displayNameFunctions;
  }
})();
