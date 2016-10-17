'use strict';

describe('ArrayHelper', function () {
  var serviceArrayHelper;

  beforeEach(module('common.arrayHelper'));

  beforeEach(inject(function(ArrayHelper) {
    serviceArrayHelper = ArrayHelper;
  }));

  it('should be an empty value', function() {
    var result = serviceArrayHelper.isEmpty('');
    expect(result).toBe(true);

    result = serviceArrayHelper.isEmpty(null);
    expect(result).toBe(true);

    result = serviceArrayHelper.isEmpty(undefined);
    expect(result).toBe(true);
  });

  it('should not be an empty value', function() {
    var result = serviceArrayHelper.isEmpty('tet');
    expect(result).toBe(false);
  });

  it('should convert object properties into empty arrays', function() {
    var data = {
      one: [''],
      two: [null],
      three: [undefined],
      four: ['test'],
      five: 'test',
      six: ['', '', 'test', '', 'test2']
    };

    serviceArrayHelper.convertEmptyArraysOfObject(data);
    expect(data.one.length).toBe(0);
    expect(data.two.length).toBe(0);
    expect(data.three.length).toBe(0);
    expect(data.four.length).toBe(1);
    expect(data.five).toBe('test');
    expect(data.six.length).toBe(2);
    expect(data.six[0]).toBe('test');
  });

  it('should initialize the array values', function() {
    var data = {
      one : [],
      two: 'test',
      three: ['one']
    };

    serviceArrayHelper.initializeEmptyArraysOfObject(data);

    expect(data.one.length).toBe(1);
    expect(data.two).toBe('test');
    expect(data.three[0]).toBe('one');
  });

  it('should initialize array with minimum length', function () {
    var array = [];
    serviceArrayHelper.initArray(array, '', 3);

    expect(array.length).toBe(3);
  });

  it('should check if its an empty object', function() {
    var obj1 = {
      one : [],
      two: 'test',
      three: ['one']
    };

    var obj2 = {one: ''};

    expect(serviceArrayHelper.isEmptyObject(obj1)).toBe(false);
    expect(serviceArrayHelper.isEmptyObject(obj2)).toBe(true);

  });

  it('should search given value from array', function() {
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5], 3)).toEqual(2);
  });

  it('should search given value from 2-element array', function() {
    expect(serviceArrayHelper.searchSortedArray([1, 2], 1)).toEqual(0);
    expect(serviceArrayHelper.searchSortedArray([1, 2], 2)).toEqual(1);
  });

  it('should search given value from array - 0th elem, last element', function() {
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5, 6], 1)).toEqual(0);
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5, 6], 6)).toEqual(5);
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5], 5)).toEqual(4);
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5], 1)).toEqual(0);
  });

  it('should not to find in an array - all possible cases', function() {
    //empty and undefined array
    expect(serviceArrayHelper.searchSortedArray(undefined, 1)).toEqual(-1);
    expect(serviceArrayHelper.searchSortedArray([], 5)).toEqual(-1);
    //possible first and last elements - odd size array
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5], 6)).toEqual(-1);
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5], 0)).toEqual(-1);
    //possible first and last elements - even size array
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5, 6], 7)).toEqual(-1);
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5, 6], 0)).toEqual(-1);
    // middle of elements
    expect(serviceArrayHelper.searchSortedArray([10, 20, 30, 40, 50, 60], 15)).toEqual(-1);
    expect(serviceArrayHelper.searchSortedArray([10, 20, 30, 40, 50, 60], 45)).toEqual(-1);
  });

  it('should find from array - odd size array', function() {
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5], 5)).toEqual(4);
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5], 1)).toEqual(0);
    expect(serviceArrayHelper.searchSortedArray([1, 2, 3, 4, 5], 3)).toEqual(2);
  });

  it('should find from array - even size array', function() {
    expect(serviceArrayHelper.searchSortedArray([10, 20, 30, 40, 50, 60], 30)).toEqual(2);
    expect(serviceArrayHelper.searchSortedArray([10, 20, 30, 40, 50, 60], 40)).toEqual(3);
    expect(serviceArrayHelper.searchSortedArray([10, 20, 30, 40, 50, 60], 10)).toEqual(0);
    expect(serviceArrayHelper.searchSortedArray([10, 20, 30, 40, 50, 60], 60)).toEqual(5);
  });

});
