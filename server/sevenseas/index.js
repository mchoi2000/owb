"use strict";

var sevenSeasLanguageAndViewMap = require("./sevenseas-language-map.json"),
    _ = require("lodash"),
    localeForDeltaViewName,
    allViewsForBaseLanguage,
    deltaViewsForBaseLanguage,
    baseViewsForBaseLanguages,
    allViewsWithDeltaStatus,
    allParentViewsForDataSource,
    allDeltaViewsForDataSource,
    baseLanguageToParentViewMap;

function getWCMLanguageAndViewMap () {
    return sevenSeasLanguageAndViewMap;
}

function getLocaleForDeltaViewName (deltaViewName) {
    if (!localeForDeltaViewName) {
        localeForDeltaViewName = _.zipObject(_.map(sevenSeasLanguageAndViewMap.localeMap, (localeMapValue) => {
            return localeMapValue.primaryView;
        }), _.keys(sevenSeasLanguageAndViewMap.localeMap));
    }
    return _.get(localeForDeltaViewName, deltaViewName, null);
}

function getBaseLanguageForLocale (locale) {
    return _.get(sevenSeasLanguageAndViewMap.localeMap, locale, {}).language;
}

function getParentViewForDeltaView (deltaViewName) {
    return _.get(sevenSeasLanguageAndViewMap.viewMap, deltaViewName, {}).parentView;
}

function getAllViewsForBaseLanguage (baseLanguage) {
    if (!allViewsForBaseLanguage) {
        allViewsForBaseLanguage = _.transform(sevenSeasLanguageAndViewMap.viewMap, (result, viewInfo, viewName) => {
            let baseLanguage = _.get(viewInfo, "language");

            return (result[baseLanguage] || (result[baseLanguage] = [])).push(viewName);
        }, {});
    }

    return _.get(allViewsForBaseLanguage, baseLanguage, []);
}

function getDeltaViewsForBaseLanguage (baseLanguage) {
    if (!deltaViewsForBaseLanguage) {
        deltaViewsForBaseLanguage = _.transform(sevenSeasLanguageAndViewMap.viewMap, (result, viewInfo, viewName) => {
            let baseLanguage = _.get(viewInfo, "language");

            return viewInfo.isDelta ? (result[baseLanguage] || (result[baseLanguage] = [])).push(viewName) : null;
        }, {});
    }

    return _.get(deltaViewsForBaseLanguage, baseLanguage, []);
}

function getBaseViewForBaseLanguage (baseLanguage) {
    if (!baseViewsForBaseLanguages) {
        baseViewsForBaseLanguages = _.transform(sevenSeasLanguageAndViewMap.viewMap, (result, viewInfo, viewName) => {
            let baseLanguage = _.get(viewInfo, "language");

            return !viewInfo.isDelta ? (result[baseLanguage] = viewName) : null;
        }, {});
    }

    return _.get(baseViewsForBaseLanguages, baseLanguage, null);
}

function getAllLocalesWithDeltaStatus () {
    if (!allViewsWithDeltaStatus) {
        allViewsWithDeltaStatus = _.chain(sevenSeasLanguageAndViewMap.viewMap)
            .map((viewInfo, viewName) => {
                return {
                    locale: viewInfo.isDelta ? getLocaleForDeltaViewName(viewName) : viewInfo.language,
                    delta: viewInfo.isDelta || false
                };
            })
            .compact()
            .sortBy((item) => {
                return item.delta;
            })
            .value();
    }

    return allViewsWithDeltaStatus;
}

function getAllParentViewsForDataSource () {
    if (!allParentViewsForDataSource) {
        allParentViewsForDataSource = _.chain(sevenSeasLanguageAndViewMap.viewMap)
            .map((viewInfo, viewName) => {
                return (!viewInfo.isDelta) ? buildViewNameForDataSource(viewName) : null;
            })
            .compact()
            .value();
    }

    return allParentViewsForDataSource;
}

function getAllDeltaViewsForDataSource () {
    if (!allDeltaViewsForDataSource) {
        let deltaLocalesToViewNameMap = _.chain(sevenSeasLanguageAndViewMap.localeMap)
            .map((localeInfo, locale) => {
                let matchedViewInfo = _.find(sevenSeasLanguageAndViewMap.viewMap, (viewInfo, viewName) => {
                    return viewName === localeInfo.primaryView;
                });
                return (matchedViewInfo.isDelta) ? {
                    locale: locale,
                    viewName: buildViewNameForDataSource(localeInfo.primaryView)
                } : null;
            })
            .compact()
            .transform((result, viewInfo) => {
                result[viewInfo.locale] = viewInfo.viewName;
                return result[viewInfo.locale]
            }, {})
            .value();

        allDeltaViewsForDataSource = _.zipObject(_.keys(deltaLocalesToViewNameMap),
            _.values(deltaLocalesToViewNameMap));
    }

    return allDeltaViewsForDataSource;
}

function buildViewNameForDataSource (viewName) {
    return `allProducts/${viewName}`;
}

function getBaseLanguageToParentViewMap () {
    if (!baseLanguageToParentViewMap) {
        let allBaseLanguages = [],
            allParentViewNames = [];

        _.forEach(sevenSeasLanguageAndViewMap.viewMap, (viewInfo, viewName) => {
            if (!viewInfo.isDelta) {
                allParentViewNames.push(viewName);
                allBaseLanguages.push(viewInfo.language);
            }
        });

        baseLanguageToParentViewMap = _.zipObject(allBaseLanguages, allParentViewNames);
    }

    return baseLanguageToParentViewMap;
}

function isBaseLanguage (locale) {
    return _.chain(sevenSeasLanguageAndViewMap.localeMap)
        .map((locale) => {
            return locale.language;
        })
        .includes(locale)
        .value();
}

function getAllLocalesForBaseLanguage (language) {
    return _.chain(sevenSeasLanguageAndViewMap.localeMap)
        .map((localeInfo, locale) => {
            return localeInfo.language === language ? locale : null;
        })
        .compact()
        .value();
}

function getAllBaseLanguages () {
    return _.chain(sevenSeasLanguageAndViewMap.localeMap)
        .map((localeInfo) => {
            return localeInfo.language;
        })
        .compact()
        .uniq()
        .value();
}

function getAllLocales () {
    return _.chain(sevenSeasLanguageAndViewMap.localeMap)
        .keys()
        .compact()
        .value();
}

function getAllCountries () {
    return _.chain(sevenSeasLanguageAndViewMap.localeMap)
        .map((localeInfo) => {
            return localeInfo.country;
        })
        .compact()
        .value();
}

function getBaseLanguagesMappedToCountries () {
    return _.chain(sevenSeasLanguageAndViewMap.localeMap)
        .transform((accumulator, localeInfo) => {
            (accumulator[localeInfo.language] || (accumulator[localeInfo.language] = [])).push(localeInfo.country);
        }, {})
        .value();
}

function getBaseLanguagesMappedToLocales () {
    return _.chain(sevenSeasLanguageAndViewMap.localeMap)
        .transform((accumulator, localeInfo, locale) => {
            (accumulator[localeInfo.language] || (accumulator[localeInfo.language] = [])).push(locale);
        }, {})
        .value();
}

function getLocaleForBaseLanguageAndCountry (baseLanguage, country) {
    return _.chain(sevenSeasLanguageAndViewMap.localeMap)
        .findKey((localeInfo) => {
            return localeInfo.language === baseLanguage && localeInfo.country === country;
        })
        .value();
}

function getAvailableOnForSingleLocale (locale) {
    let baseLangForLocale = getBaseLanguageForLocale(locale),
        availableOn = getAllLocalesForBaseLanguage(baseLangForLocale);

    _.pull(availableOn, locale);

    return availableOn;
}

module.exports = {
    getWCMLanguageAndViewMap: getWCMLanguageAndViewMap,
    getLocaleForDeltaViewName: getLocaleForDeltaViewName,
    getBaseLanguageForLocale: getBaseLanguageForLocale,
    getParentViewForDeltaView: getParentViewForDeltaView,
    getAllViewsForBaseLanguage: getAllViewsForBaseLanguage,
    getDeltaViewsForBaseLanguage: getDeltaViewsForBaseLanguage,
    getBaseViewForBaseLanguage: getBaseViewForBaseLanguage,
    getAllLocalesWithDeltaStatus: getAllLocalesWithDeltaStatus,
    getAllParentViewsForDataSource: getAllParentViewsForDataSource,
    getAllDeltaViewsForDataSource: getAllDeltaViewsForDataSource,
    buildViewNameForDataSource: buildViewNameForDataSource,
    getBaseLanguageToParentViewMap: getBaseLanguageToParentViewMap,
    isBaseLanguage: isBaseLanguage,
    getAllLocalesForBaseLanguage: getAllLocalesForBaseLanguage,
    getAllBaseLanguages: getAllBaseLanguages,
    getAllLocales: getAllLocales,
    getAllCountries: getAllCountries,
    getBaseLanguagesMappedToCountries: getBaseLanguagesMappedToCountries,
    getBaseLanguagesMappedToLocales: getBaseLanguagesMappedToLocales,
    getLocaleForBaseLanguageAndCountry: getLocaleForBaseLanguageAndCountry,
    getAvailableOnForSingleLocale: getAvailableOnForSingleLocale
};
