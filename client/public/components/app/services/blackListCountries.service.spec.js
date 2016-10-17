'use strict';

describe('Blacklist Countries List', function() {
  var blacklistService;

  beforeEach(module('common.countries'));

  beforeEach(inject(function(BlackListCountriesService) {
    blacklistService = BlackListCountriesService;
  }));

  it('should contain countries', function() {
    expect(typeof blacklistService.getCountryNames() !== 'undefined').toBe(true);
  });
  it('should contain countries', function() {
    expect(typeof blacklistService.getCountries() !== 'undefined').toBe(true);
  });
  it('should get all countries', function() {
    expect(typeof blacklistService.getAllCountries() !== 'undefined').toBe(true);
  });
});
