'use strict';

describe('File Upload Directive', function() {
  var compile, scope, element, elementWithoutData;

  beforeEach(module('common.upload', 'common/app/upload/fileUpload.html'));

  beforeEach(inject(function($injector, Upload, $compile, $rootScope) {
    compile = $compile;
    scope = $rootScope.$new();
    element = angular.element('<form><pwb-file-upload ' +
      'model="test" label="test" description="test" types="images/*" size-limit="10kb"' +
      'input-id="test" valid-height="540" valid-width="960" existing-data="http://test/test.jpg" ' +
      'is-required="true" input-name="test" overwrite-name="test"> </pwb-file-upload></form>');

    elementWithoutData = angular.element('<form><pwb-file-upload ' +
      'model="test" label="test" description="test" types="images/*" size-limit="10kb"' +
      'input-id="test" input-name="test" valid-height="540" valid-width="960"' +
      'is-required="true"> </pwb-file-upload></form>');

    compile(element)(scope);
    compile(elementWithoutData)(scope);
    scope.$digest();

    Upload.imageDimensions = function(file) {
      return {
        then: function(callback) {
          if (file.name) {
            return callback({width: 960, height: 540});
          } else {
            return callback({width: 0, height: 0});
          }
        }
      };
    };

    Upload.rename = function(file, newName) {
      expect(file).toBeDefined();
      expect(newName).toEqual('test.jpg');
      return {name: 'test', type: 'jpg'};
    };
  }));

  it('should create a file upload directive', function() {
    var directiveScope = element.children().isolateScope();
    expect(directiveScope.label).toEqual('test');
    expect(directiveScope.description).toEqual('test');
    expect(directiveScope.types).toEqual('images/*');
    expect(directiveScope.sizeLimit).toEqual('10kb');
    expect(directiveScope.inputId).toEqual('test');
    expect(directiveScope.validHeight).toEqual('540');
    expect(directiveScope.validWidth).toEqual('960');
    expect(directiveScope.existingData).toEqual('http://test/test.jpg');
    expect(directiveScope.isRequired).toEqual(true);
    expect(directiveScope.inputName).toEqual('test');
    expect(directiveScope.form).toBeDefined();
  });

  it('should upload a file with a valid aspect', function() {
    var directiveScope = element.children().isolateScope();
    directiveScope.checkImage(undefined);
    directiveScope.checkImage({name: 'good.jpg'});
    expect(directiveScope.form.test.$error.validAspect).toBe(undefined);
  });

  it('should upload a file with a valid aspect and non forced name', function() {
    var directiveScope = elementWithoutData.children().isolateScope();
    directiveScope.checkImage(undefined);
    directiveScope.checkImage({name: 'good.jpg'});
    expect(directiveScope.form.test.$error.validAspect).toBe(undefined);
  });

  it('file should have a bad aspect ERROR', function() {
    var directiveScope = element.children().isolateScope();
    directiveScope.checkImage('bad');
    expect(directiveScope.form.test.$error.validAspect).toBe(true);
  });

  it('should remove the file', function() {
    var directiveScope = element.children().isolateScope();
    directiveScope.form.test.$setViewValue({});
    directiveScope.removeFile();
    expect(directiveScope.form.test.$viewValue).toBeUndefined();
  });
});
