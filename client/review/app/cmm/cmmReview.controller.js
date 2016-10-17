//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('review.cmm').controller('ctrlCMMReviewForm', [
    '$q',
    '$window',
    '$routeParams',
    '$http',
    '$timeout',
    'NavigationService',
    'ProductsFactory',
    'UserService',
    'BlackListCountriesService',
    'groupByFilter',
    'ArrayHelper',
    'cmmBlacklistReasons',
    'omBlacklistReasons',
    'languages',
    'contentSections',
    'contentSectionsCollapse',
    'LanguageDisplayName',
    controller
  ]);
  /* jshint maxparams: 20 */
  /*jshint maxstatements: 50 */
  function controller($q, $window, $routeParams, $http, $timeout, NavigationService,
                      ProductsFactory, UserService, BlackListCountriesService,
                      groupByFilter, ArrayHelper, cmmBlacklistReasons, omBlacklistReasons,
                      languages, contentSections, contentSectionsCollapse, LanguageDisplayName) {

    /* jshint validthis: true */
    var self = this;

    self.blReasons = cmmBlacklistReasons;
    self.contactList = [];
    self.sectionList = contentSections;

    self.sectionTabsCollapse = contentSectionsCollapse;
    self.langHash = {};
    languages.forEach(function buildHash(lang) {
      self.langHash[lang.value] = lang;
    });

    self.blacklistList = [];
    self.IOTs = [];
    self.areas = [];
    self.locales = [];

    self.blRadioChoices = [
      {display: 'Approve', value: true},
      {display: 'Do not publish', value: false}
    ];

    self.sectionNav = new NavigationService(self.sectionList, 703, 130);
    self.iotNav = new NavigationService(self.iotList, 703, 130);
    self.navs = [self.sectionNav, self.iotNav];

    self.activeTab = 0;

    // Controller Functions
    self.generateId = generateId;
    self.selectLanguage = selectLanguage;
    self.addReasonToBlacklist = addReasonToBlacklist;
    self.modifyBlacklist = modifyBlacklist;
    self.saveBlacklistOffering = saveBlacklistOffering;
    self.listMaker = listMaker;
    self.onScroll = onScroll;
    self.removeFromLists = removeFromLists;

    self.expandSection = expandSection;
    self.expandIOTSection = expandIOTSection;

    self.loadingPage = true;
    self.saveInProgress = false;
    self.timeSaved = '';
    self.finishedSaving = false;

    self.initialize = initialize;

    ///////////////////////////////

    function generateId(name) {
      var id = name.replace(/\s+/g, '');
      id = id.toLowerCase();
      return id;
    }

    function selectLanguage(lang) {
      self.currentLanguage = lang;

      if (lang.value !== 'en-us') {
        self.content = self.fullContent.i18n[lang.value].value.product;
      } else {
        self.content = self.fullContent.value.product;
      }
    }

    function modifyBlacklist(isApproveSelected, countryCode) {
      if (isApproveSelected) {
        setApproved(countryCode);
      } else {
        setBlacklist(countryCode);
      }
    }

    function removeFromLists(country) {
      self.blacklistList = self.blacklistList.filter(filterBlackLists);

      function filterBlackLists(blacklist) {
        return blacklist.locale !== country.code;
      }

      country.selectedReason = null;

      //Reset country code
      setMarketConfig(country.code, true, 0);
    }

    function setMarketConfig(countryCode, blacklisted, reason) {
      self.product.countryMktConfig[countryCode].globalizationMgr.blacklisted = blacklisted;
      self.product.countryMktConfig[countryCode].globalizationMgr.reason = reason;
      self.product.countryMktConfig[countryCode].globalizationMgr.lastModified = {
        by: self.currentUser._id,
        at: Date.now()
      };
    }

    function setApproved(code) {
      var index = self.blacklistList.map(function getLocales(obj) {return obj.locale;})
        .indexOf(code);
      if (index > -1) {
        self.blacklistList.splice(index, 1);
      }
      setMarketConfig(code, false);
    }

    function setBlacklist(code) {
      self.blacklistList.push({
        locale: code,
        reason: ''});
      setMarketConfig(code, true, '');
    }

    function addReasonToBlacklist(locale, reason) {
      var index = self.blacklistList.map(function getLocales(obj) {return obj.locale;})
        .indexOf(locale);
      if (index > -1) {
        self.blacklistList[index].reason = reason;
      }
      else {
        self.blacklistList.push({
          locale: locale,
          reason: reason});
      }
      setMarketConfig(locale, true, reason);
    }

    function saveBlacklistOffering(close) {
      self.finishedSaving = false;

      $http.post('api/translation/blacklistOffering/' + $routeParams.id, {
        blacklistLocales: self.blacklistList,
        marketConfig: self.product.countryMktConfig
      })
      .then(function resolveResponse() {
        if (close) {
          $window.location.href = 'review/cmm';
        }
        self.saveInProgress = false;
        self.timeSaved = new Date();
        initialize();

        $timeout(function timeoutCallback() {
          self.loadingPage = false;
          self.finishedSaving = true;
        }, 750);

      });
    }

    function listMaker(arr) {
      if (arr === undefined || arr.length === 0) {
        return 'NONE';
      }
      var listString = arr.join(', ');
      return listString;
    }

    function onScroll() {
      self.navs[self.activeTab].scrollToSection();
    }

    function initialize() {
      self.blacklistList = [];

      if (self.timeSaved === '') {
        $window.addEventListener('scroll', self.onScroll);
      }

      var productId = $routeParams.id;

      var blacklist = [];
      return ProductsFactory.getProduct(productId)
        .then(function resolveProduct(product) {
          self.product = product.data;

          if (self.timeSaved === '') {
            if (self.product.offeringManager) {
              self.contactList.push({
                fname: self.product.offeringManager.firstName,
                lname: self.product.offeringManager.lastName,
                email: self.product.offeringManager.email,
                projectRole: 'Offering Manager'
              });
            }

            if (self.product.marketingManager) {
              self.contactList.push({
                fname: self.product.marketingManager.firstName,
                lname: self.product.marketingManager.lastName,
                email: self.product.marketingManager.email,
                projectRole: 'Marketing Manager'
              });
            }
          }

          self.product.countryMktConfig = self.product.countryMktConfig || {};

          return $q.all([
            ProductsFactory.getByContentId(self.product.wcm.productionId),
            BlackListCountriesService.getCountries(),
            UserService.getUser(self.product.owner),
            UserService.get()
          ]);
        })
        .then(function resolveContent(results) {
          var content = results[0].data;
          var countries = results[1].data;
          self.fullContent = content;
          self.currentUser = results[3];
          self.content = content.value.product;

          self.completedTranslations = ['en-us'];
          for (var locale in self.fullContent.i18n) {
            self.completedTranslations.push(locale);
          }

          $timeout(resolveBlacklistTab.bind(undefined, countries));

          var owner = results[2];
          if (owner.projectRole !== 'Offering Manager' &&
              owner.projectRole !== 'Marketing Manager' && self.timeSaved === '') {
            self.contactList.push(owner);
          }
          self.relatedProducts = self.content['related-products'];
          $timeout(function timeoutCallback() {
            if (self.timeSaved === '') {
              self.loadingPage = false;
            }
          }, 0);
        });
    }

    function resolveBlacklistTab(countries) {
      self.locales = self.completedTranslations.map(function mapToDisplay(locale) {
        return {display:
          generateLanguageName({country: locale.slice(3).toLowerCase(), language: locale}),
          value: locale};
      });
      self.currentLanguage = self.locales[0];
      countries.forEach(function iterate(country) {
        country.translatedLanguages = country.languages.filter(function filter(item) {
          return self.completedTranslations.indexOf(item) > -1;
        }).map(function (locale) {

          var display = generateLanguageName(
            {country: locale.slice(3).toLowerCase(), language: locale});

          if (locale === 'es-la' || locale === 'es-LA') {
            return {value: locale, display: display};
          } else {
            return {value: locale.substring(0, 3) + country.code.toLowerCase(),
              display: display};
          }

        });

        country.untranslatedLanguages = country.languages.filter(function filter(item) {
          return self.completedTranslations.indexOf(item) === -1;
        }).map(function (locale) {
          return generateLanguageName({country: locale.slice(3).toLowerCase(), language: locale});
        });

        //binary serach
        var countryInBlacklist = self.product.countryMktConfig[country.code];

        country.active = country.translatedLanguages.length > 0;
        //TODO: deal with strings and numbers and booleans --- form data
        if (country.active) {
          if (countryInBlacklist && !countryInBlacklist.globalizationMgr.blacklisted) {
            country.status = 'Approved by';
            country.approved = true;
            if (countryInBlacklist.globalizationMgr.lastModified) {
              UserService.getUser(countryInBlacklist.globalizationMgr.lastModified.by)
                .then(function getUser(user) {
                  country.modifiedBy = user.fname + ' ' + user.lname;
                });
              country.at = countryInBlacklist.globalizationMgr.lastModified.at;
            }
          } else {
            if (countryInBlacklist &&
                countryInBlacklist.globalizationMgr.blacklisted &&
                countryInBlacklist.globalizationMgr.reason !== '0') {
              country.status = 'Blacklisted by';
              country.approved = false;
              country.selectedReason = countryInBlacklist.globalizationMgr.reason;
              if (countryInBlacklist.globalizationMgr.lastModified) {
                UserService.getUser(countryInBlacklist.globalizationMgr.lastModified.by)
                  .then(function getUser(user) {
                    country.modifiedBy = user.fname + ' ' + user.lname;
                  });
                country.at = countryInBlacklist.globalizationMgr.lastModified.at;
              }
            } else {
              country.status = 'Awaiting review by Country Manager';
              country.statusAlert = true;
            }
          }

          if (countryInBlacklist &&
              countryInBlacklist.offeringMgr &&
              countryInBlacklist.offeringMgr.blacklisted &&
              countryInBlacklist.offeringMgr.reason) {
            var omIndex = parseInt(countryInBlacklist.offeringMgr.reason.slice(-1)) - 1;
            country.offeringMgrReason = omBlacklistReasons[omIndex].display;
          }
        }
      });

      // Group by IOT
      self.IOTs = groupByFilter(countries, 'IOT');
      generateSectionList(self.IOTs);

      //Group by Area
      self.IOTs.forEach(function groupAreas(iot) {
        iot.group = groupByFilter(iot.group, 'area');

        iot.group.forEach(function addCollapse(country) {
          country.collapsed = false;
        });
      });
    }

    function generateLanguageName(locale) {
      try {
        return LanguageDisplayName.getDisplayName(locale);
      }
      catch (error) {
        return null;
      }
    }

    function generateSectionList(IOTs) {
      self.iotNav.sectionList = IOTs.map(function addToSectionList(iot) {
        return {name: generateId(iot.label), value: iot.label};
      });
    }

    function expandSection(section) {
      self.sectionTabsCollapse[section] = false;
    }

    function expandIOTSection(section) {
      self.IOTs.forEach(function checkForSection(iot) {
        if (section === iot.label) {
          iot.collapsed = false;

          iot.group.forEach(function expandSectionsInIot(country) {
            country.collapsed = false;
          });
        }
      });
    }

    initialize();
  }
})();
