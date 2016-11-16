//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmmDash').controller('CMMDashboard',
    ['$filter',
    '$http',
    '$cookies',
    'ProductsFactory',
    'BlackListCountriesService',
    'cmmBlacklistReasons',
    'omBlacklistReasons',
    'cmmData', controller]);

  /*jshint maxstatements: 100 */
  function controller($filter,
    $http,
    $cookies,
    ProductsFactory,
    BlackListCountriesService,
    cmmBlacklistReasons,
    omBlacklistReasons,
    cmmData) {
    /* jshint validthis: true */
    var _this = this;
    var endOfProducts = false;
    _this.productList = [];
    _this.PAGELIMIT = 12;
    _this.displayEmpty = false;
    _this.queryParams = {};
    _this.newSearch = '';
    _this.loadingPage = true;

    _this.sortOptionsList = cmmData.sortOptionsList;
    _this.statusList = cmmData.statusList;

    _this.languageList = JSON.parse(JSON.stringify(cmmData.languageList));
    _this.reasonList1 = cmmData.reasonList1;
    _this.reasonList2 = cmmData.reasonList2;

    _this.cmmReasonList = cmmBlacklistReasons;
    _this.providerReasonList = omBlacklistReasons;

    _this.countryList = '';

    _this.countryLanguageList = '';
    _this.localeList = [];
    _this.sortOption = 'country';
    _this.sortField = false;

    _this.countrySelected = {
      name: '',
      code: ''
    };
    _this.selectedLangs = [];
    _this.statusSelected = '';
    _this.reasonSelected = {
      display: '',
      value: ''
    };
    var indexedCountries = [];

    /* _this.countriesToFilter = countriesToFilter;
     function countriesToFilter() {
       indexedCountries = [];
       return _this.countryList;
     }

     _this.filterCountries = filterCountries;
     function filterCountries(country) {
       var countryNew = (indexedCountries.indexOf(country.IOT) === -1);
       if (countryNew) {
         indexedCountries.push(country.IOT);
       }
       return countryNew;
     }

    _this.updatedSort = false;

    //Make Recent Activity always selected
    _this.updateSortProducts = updateSortProducts;
    updateSortProducts(_this.sortOptionsList[0].name, _this.sortOptionsList[0].value, true);
    function updateSortProducts(name, value, initial) {
      if (!initial) {
        _this.updatedSort = true;
      }
      _this.sortProducts = {
        name: name,
        value: value
      };
    }

    _this.updateSelectedLangs = updateSelectedLangs;
    function updateSelectedLangs(clear) {
      if (!clear) {
        _this.languageList
          .filter(function(lang) {return lang.isSelected;})
          .map(function(lang) {return lang.value;});
      }
      else {
        _this.languageList = JSON.parse(JSON.stringify(cmmData.languageList));
        _this.selectedLangs = [];
        _this.setSelectedLangs();
      }
    }

    _this.setSelectedLangs = setSelectedLangs;
    function setSelectedLangs() {
      _this.selectedLangs = [];
      _this.languageList.forEach(function setSelected(lang, pos) {
        if (lang.isSelected) {
          _this.selectedLangs.push({name: lang.name, value: lang.value, index: pos});
        }
      });

    }

    _this.unSelectLang = unSelectLang;
    function unSelectLang(index, selectedIndex) {
      _this.languageList[index].isSelected = false;
      _this.selectedLangs.splice(selectedIndex, 1);
    }

    // Search Filter
    _this.updateSearch = updateSearch;
    function updateSearch(query) {
      _this.searchQuery = query;
      _this.newSearch = '';
    }

    _this.searchProduct = searchProduct;
    function searchProduct(product) {
      return (
        angular.lowercase(product.searchTerms)
          .indexOf(angular.lowercase(_this.searchQuery || '')) !== -1);
    }

    // Country Filter
    _this.countryFilter = countryFilter;
    function countryFilter (product) {
      if (_this.countrySelected.code === '') {
        return true;
      }
      else {
        for (var i = 0; i < product.wcm.locales.length; i++) {
          var countryLocale = product.wcm.locales[i].substring(3, 5);

          if (countryLocale.toLowerCase() === _this.countrySelected.code.toLowerCase()) {
            return true;
          }
        }
      }

      return false;
    }

    // Language Filter
    _this.languageFilter = languageFilter;
    function languageFilter (product) {
      /*jshint maxcomplexity:50

      // Cycles through product.wcm.locales
      // Returns true if at least one selected language matches
      if (_this.selectedLangs.length === 0) {
        return true;
      }
      else {
        for (var i = 0; i < _this.selectedLangs.length; i++) {
          // Check if English, return all since all have english translation
          if (_this.selectedLangs[i].value === 'en') {
            return true;
          }
          else {
            for (var j = 0; j < product.wcm.locales.length; j++) {
              var langLocale = product.wcm.locales[j].substring(0, 2);

              // Check for Spanish (Latin America) with all product.wcm.locales
              if (_this.selectedLangs[i].value === 'es-la' &&
                  _this.selectedLangs[i].value === product.wcm.locales[j]) {
                return true;
              }
              // Check for French (Canada) with all product.wcm.locales
              else if (_this.selectedLangs[i].value === 'fr-ca' &&
                       _this.selectedLangs[i].value === product.wcm.locales[j]) {
                return true;
              }
              // Check for Chinese (Traditional) and (Simplified) with all product.wcm.locales
              else if (_this.selectedLangs[i].value === 'zh-cn' &&
                       _this.selectedLangs[i].value === product.wcm.locales[j]) {
                return true;
              }
              else if (_this.selectedLangs[i].value === 'zh-tw' &&
                       _this.selectedLangs[i].value === product.wcm.locales[j]) {
                return true;
              }
              // Check remaining languages by using only the language part of locales
              // Exclude the previous specific languages
              else if (_this.selectedLangs[i].value === langLocale &&
                       _this.selectedLangs[i].value !== 'es-la' &&
                       _this.selectedLangs[i].value !== 'fr-ca' &&
                       _this.selectedLangs[i].value !== 'zh-cn' &&
                       _this.selectedLangs[i].value !== 'zh-tw') {
                return true;
              }
            }
          }

        }
      }

      return false;
    }

    // Status Filter
    _this.statusFilter = statusFilter;
    function statusFilter (product) {
      /*jshint maxcomplexity:20
      if (_this.statusSelected === '') {
        return true;
      }
      else {
        for (var countryCode in product.countryMktConfig) {
          var country = product.countryMktConfig[countryCode];

          if (_this.statusSelected === 'Awaiting Review by Country Manager' &&
              country.globalizationMgr.blacklisted &&
              country.globalizationMgr.reason === '0') {
            return true;
          }
          else if (_this.statusSelected === 'Approved by Country Manager' &&
                   !country.globalizationMgr.blacklisted) {
            return true;
          }
          else if (_this.statusSelected === 'Blacklisted by Country Manager' &&
                   country.globalizationMgr.blacklisted &&
                   _this.reasonSelected.value === '') {
            return true;
          }
          else if (_this.statusSelected === 'Blacklisted by Offering Provider' &&
                   country.offeringMgr.blacklisted &&
                   _this.reasonSelected.value === '') {
            return true;
          }
          else if (_this.statusSelected === 'Blacklisted by Country Manager' &&
                   country.globalizationMgr.blacklisted &&
                   country.globalizationMgr.reason === _this.reasonSelected.value) {
            return true;
          }
          else if (_this.statusSelected === 'Blacklisted by Offering Provider' &&
                   country.offeringMgr.blacklisted &&
                   country.offeringMgr.reason === _this.reasonSelected.value) {
            return true;
          }

        }
      }
      return false;
    } */

    _this.initialize = initialize;
    function initialize() {
      _this.queryParams.page = 1;
      _this.queryParams.limit = _this.PAGELIMIT;
      _this.queryParams.search = '';
      queryProducts();

      BlackListCountriesService.getLocales()
        .then(function getLocalesList(result) {
          _this.localeList = result;

        });
    }

    function queryProducts() {
      _this.loadingPage = true;
      /*ProductsFactory.getTranslateDocs()
        .then(function getByStatusCallback(result) {
          if (result.data.docs.length === 0) {
            _this.displayEmpty = true;
            endOfProducts = true;
          } else {
            _this.displayEmpty = false;
            _this.productList = _this.productList.concat(result.data.docs);
          }

          _this.searchComplete = true;
          _this.searchQuery = _this.queryParams.search;

          _this.loadingPage = false;

        }); */
    }

    _this.initialize();
  }
})();
