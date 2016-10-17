//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.arrayHelper', []).service('ArrayHelper', [ArrayHelper]);

  function ArrayHelper() {

    var service = {
      isEmpty: isEmpty,
      isNotEmpty: isNotEmpty,
      convertEmptyArraysOfObject: convertEmptyArraysOfObject,
      initializeEmptyArraysOfObject: initializeEmptyArraysOfObject,
      initArray: initArray,
      isEmptyObject: isEmptyObject,
      searchSortedArray: searchSortedArray
    };

    function isEmpty(value) {
      return value === undefined || value === '' || value === null;
    }

    function isNotEmpty(value) {
      return value !== undefined && value !== '' && value !== null;
    }

    function convertEmptyArraysOfObject(obj) {
      Object.keys(obj).forEach(function(key) {
        if (obj[key] instanceof Array) {
          obj[key] = obj[key].filter(isNotEmpty);
        }
      });
    }

    function initializeEmptyArraysOfObject(obj) {
      Object.keys(obj).forEach(function(key) {
        // key: the name of the object key
        if (obj[key] instanceof Array) {
          if (obj[key].length === 0) {
            obj[key].push('');
          }
        }
      });
    }

    function initArray(array, defaultValue, minLength) {
      while (array.length < minLength) {
        array.push(angular.copy(defaultValue));
      }
    }

    //This method will walk an object tree and determine whether an object is empty or not
    function isEmptyObject(obj) {
      //typeof yourVariable === 'object
      var isEmpty = true;
      Object.keys(obj).forEach(function(key) {
        if (isNotEmpty(obj[key])) {
          isEmpty = false;
        }
      });
      return isEmpty;
    }

    /* This function is used for searching an element in a sorted array.
       parameters: A sorted array and element to be searched
       Returns: 'index' of the element in an array if found / -1 if element is not found */
    function searchSortedArray(array, value) {
      var min = 0;
      array = array || [];
      var max = array.length - 1;
      var current;
      var currentValue;

      while (min <= max) {
        current = Math.floor((min + max) / 2);
        currentValue = array[current];

        if (currentValue < value) {
          min = current + 1;
        }
        else if (currentValue > value) {
          max = current - 1;
        }
        else {
          return current;
        }
      }

      return -1;
    }

    return service;
  }
})();
