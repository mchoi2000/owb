"use strict";

var rewire = require("rewire"),
    _ = require("lodash"),
    whitelistViewHelper = rewire("../index"),
    whitelistViewConfig = require("./fixtures/seven-seas.json");

whitelistViewHelper.__set__("sevenSeasLanguageAndViewMap", whitelistViewConfig.sevenSeas);

module.exports = {
    testGetLocaleForDeltaViewName: (test) => {
        let localeForDEDelta = whitelistViewHelper.getLocaleForDeltaViewName("de-deByIdDelta"),
            expectedLocaleForDEDelta = "de-de";

        test.equal(localeForDEDelta, expectedLocaleForDEDelta);

        test.done();
    },
    testGetBaseLanguageForLocale: (test) => {
        let baseLanguageForDEDE = whitelistViewHelper.getBaseLanguageForLocale("de-de"),
            badBaseLanguage = whitelistViewHelper.getBaseLanguageForLocale("zz-zz"),
            expectedBaseLanguageForDEDE = "de";

        test.equal(baseLanguageForDEDE, expectedBaseLanguageForDEDE);
        test.equal(badBaseLanguage, null);

        test.done();
    },
    testGetParentViewForDeltaView: (test) => {
        let parentViewForDEDelta = whitelistViewHelper.getParentViewForDeltaView("de-deByIdDelta"),
            badParentView = whitelistViewHelper.getParentViewForDeltaView("zz-zzByIdDelta"),
            expectedParentViewForDE = "deById";

        test.equal(parentViewForDEDelta, expectedParentViewForDE);
        test.equal(badParentView, null);

        test.done();
    },
    testGetAllViewsForBaseLanguage: (test) => {
        let allViewsForDE = whitelistViewHelper.getAllViewsForBaseLanguage("de"),
            badViews = whitelistViewHelper.getAllViewsForBaseLanguage("zz"),
            expectedAllViewsForDE = ["de-deByIdDelta", "deById"];

        test.deepEqual(allViewsForDE, expectedAllViewsForDE);
        test.deepEqual(badViews, []);

        test.done();
    },
    testGetDeltaViewsForBaseLanguage: (test) => {
        let deltaViewsForDE = whitelistViewHelper.getDeltaViewsForBaseLanguage("de"),
            badDeltaViews = whitelistViewHelper.getDeltaViewsForBaseLanguage("zz"),
            expectedDeltaViewsForDE = ["de-deByIdDelta"];

        test.deepEqual(deltaViewsForDE, expectedDeltaViewsForDE);
        test.deepEqual(badDeltaViews, []);

        test.done();
    },
    testGetBaseViewForBaseLanguage: (test) => {
        let baseViewForDE = whitelistViewHelper.getBaseViewForBaseLanguage("de"),
            badBaseView = whitelistViewHelper.getBaseViewForBaseLanguage("zz"),
            expectedBaseViewForDE = "deById";

        test.equal(baseViewForDE, expectedBaseViewForDE);
        test.equal(badBaseView, null);

        test.done();
    },
    testGetAllLocalesWithDeltaStatus: (test) => {
        let allLocalesWithDeltaStatus = whitelistViewHelper.getAllLocalesWithDeltaStatus(),
            expectedLocalesWithDeltaStatus = whitelistViewConfig.allLocalesWithDeltaStatus;

        test.deepEqual(allLocalesWithDeltaStatus, expectedLocalesWithDeltaStatus);
        // To cover the lazy initialization branch case, call it a second time and verify
        allLocalesWithDeltaStatus = whitelistViewHelper.getAllLocalesWithDeltaStatus();
        test.deepEqual(allLocalesWithDeltaStatus, expectedLocalesWithDeltaStatus);

        test.done();
    },
    testGetAllParentViewsForDataSource: (test) => {
        let allParentViewsForDataSource = whitelistViewHelper.getAllParentViewsForDataSource(),
            expectedParentViews = whitelistViewConfig.expectedParentViewNamesForDataSource;

        test.deepEqual(allParentViewsForDataSource, expectedParentViews);
        // To cover the lazy initialization branch case, call it a second time and verify
        allParentViewsForDataSource = whitelistViewHelper.getAllParentViewsForDataSource();
        test.deepEqual(allParentViewsForDataSource, expectedParentViews);

        test.done();
    },
    testGetAllDeltaViewsForDataSource: (test) => {
        let allDeltaViewsForDataSource = whitelistViewHelper.getAllDeltaViewsForDataSource(),
            expectedDeltaViews = whitelistViewConfig.expectedDeltaViewNamesForDataSource;

        test.deepEqual(allDeltaViewsForDataSource, expectedDeltaViews);
        // To cover the lazy initialization branch case, call it a second time and verify
        allDeltaViewsForDataSource = whitelistViewHelper.getAllDeltaViewsForDataSource();
        test.deepEqual(allDeltaViewsForDataSource, expectedDeltaViews);

        test.done();
    },
    testGetBaseLanguageToParentViewMap: (test) => {
        let baseLanguageToParentViewMap = whitelistViewHelper.getBaseLanguageToParentViewMap(),
            expectedBaseLanguageToParentViewMap = whitelistViewConfig.expectedBaseLanguageToParentViewMap;

        test.deepEqual(baseLanguageToParentViewMap, expectedBaseLanguageToParentViewMap);
        // To cover the lazy initialization branch case, call it a second time and verify
        baseLanguageToParentViewMap = whitelistViewHelper.getBaseLanguageToParentViewMap();
        test.deepEqual(baseLanguageToParentViewMap, expectedBaseLanguageToParentViewMap);

        test.done();
    },
    testIsBaseLanguage: (test) => {
        let isDeDeBase = whitelistViewHelper.isBaseLanguage("de-de"),
            isEnBase;

        test.ok(!isDeDeBase);
        isEnBase = whitelistViewHelper.isBaseLanguage("en");
        test.ok(isEnBase);

        test.done();
    },
    testGetAllLocalesForBaseLanguage: (test) => {
        let allLocalesForFRCA = whitelistViewHelper.getAllLocalesForBaseLanguage("frca"),
            expectedLocalesForFRCA = ["fr-ca"];

        test.deepEqual(allLocalesForFRCA, expectedLocalesForFRCA);
        // To cover the lazy initialization branch case, call it a second time and verify
        allLocalesForFRCA = whitelistViewHelper.getAllLocalesForBaseLanguage("frca");
        test.deepEqual(allLocalesForFRCA, expectedLocalesForFRCA);

        test.done();
    },
    testGetAllBaseLanguages: (test) => {
        let allBaseLanguages = whitelistViewHelper.getAllBaseLanguages();

        test.deepEqual(allBaseLanguages, whitelistViewConfig.expectedBaseLanguages);

        test.done();
    },
    testGetAllLocales: (test) => {
        let allLocales = whitelistViewHelper.getAllLocales();

        test.deepEqual(allLocales, whitelistViewConfig.expectedLocales);

        test.done();
    },
    testGetAllCountries: (test) => {
        let allCountries = whitelistViewHelper.getAllCountries();

        test.deepEqual(allCountries, whitelistViewConfig.expectedCountries);

        test.done();
    },
    testGetBaseLanguagesMappedToCountries: (test) => {
        let baseLanguagesMappedToCountries = whitelistViewHelper.getBaseLanguagesMappedToCountries();

        test.deepEqual(baseLanguagesMappedToCountries, whitelistViewConfig.expectedBaseLanguageToCountryMap);

        test.done();
    },
    testGetBaseLanguagesMappedToLocales: (test) => {
        let baseLanguagesMappedToLocales = whitelistViewHelper.getBaseLanguagesMappedToLocales();

        test.deepEqual(baseLanguagesMappedToLocales, whitelistViewConfig.expectedBaseLanguageToLocaleMap);

        test.done();
    },
    testGetLocaleForBaseLanguageAndCountry: (test) => {
        let locale = whitelistViewHelper.getLocaleForBaseLanguageAndCountry("frca", "ca");

        test.equal(locale, "fr-ca");

        test.done();
    },
    testGetAvailableOnForSingleLocale: (test) => {
        let availableOn = whitelistViewHelper.getAvailableOnForSingleLocale("en-us"),
            expectedLocales = whitelistViewConfig.expectedBaseLanguageToLocaleMap.en;

        _.pull(expectedLocales, "en-us");

        test.deepEqual(availableOn, expectedLocales);

        test.done();
    }
};
