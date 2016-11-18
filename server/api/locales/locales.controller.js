//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var sevenseas = require('@marketplace/sevenseas');
var i18nSupport = JSON.parse(
  fs.readFileSync(path.normalize(__dirname + '/../../config/i18n-support.json')));

module.exports = {
  getCountriesWithLang: function(req, res) {
    var seveseasLocales = sevenseas.getWCMLanguageAndViewMap();

    if (!seveseasLocales || !i18nSupport || !seveseasLocales.localeMap) {
      res.status(404);
      res.json({
          reason: 'Not able to load i18nSupport or sevenseas'
        }
      );
      return res;
    } else {
      var _i18nSupport = _.mapValues(i18nSupport, function(o) {
        return o.label;
      });
      var sevenseasLocaleKeys = _.keys(seveseasLocales.localeMap);

      var results = _.pick(_i18nSupport, sevenseasLocaleKeys);
      var data = _.map(results, function(value, prop) {
        return {locale: prop, name: value};
      });

      var sortedData = _.sortBy(data, ['name'])

      res.status(200);
      res.json(sortedData);
      return res;
    }
  }
};
