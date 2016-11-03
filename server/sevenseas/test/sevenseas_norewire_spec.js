"use strict";

var sevenseasLib = require("../index"),
    sevenSeasDoc = require("../sevenseas-language-map.json");

module.exports = {
    testGetLocaleForDeltaViewName: (test) => {
        let sevenSeasDocFromLib = sevenseasLib.getWCMLanguageAndViewMap();

        test.deepEqual(sevenSeasDocFromLib, sevenSeasDoc);

        test.done();
    }
};
