'use strict';

describe('Translation Drag and Drop Upload Directive', function() {
  var compile, scope, element;

  beforeEach(function() {
    module('common.dragDropUpload', 'common/app/dragDropUpload/dragDropUpload.html');

    inject(function($injector, $compile, $rootScope) {

      compile = $compile;
      scope = $rootScope.$new();
      element = angular.element('<form><pwb-drag-drop-upload ng-model="test" on-load="test" ' +
      'on-delete="test" on-error="" name="testname"></pwb-drag-drop-upload></form>');
      compile(element)(scope);
      scope.$digest();

    });

  });

  it('should update all files with all valid test data', function() {
    var directiveScope = element.children().isolateScope();
    var testFiles = [
      {
        'file' : 'Test File 1 Data',
        'name' : 'Test File 1',
        'type' : 'application/json',
        'uploadDate' : '',
        'size' : 200000,
        'status' : '',
        'progress' : 0
      },
      {
        'file' : 'Test File 2 Data',
        'name' : 'Test File 2',
        'type' : 'application/zip',
        'uploadDate' : '',
        'size' : 300000,
        'status' : '',
        'progress' : 0
      }
    ];
    directiveScope.allfiles = testFiles;
    scope.$digest();

    expect(directiveScope.allfiles).toEqual(testFiles);
  });

  it('should check size with correct size', function() {
    var directiveScope = element.children().isolateScope();
    var testSize = 200000;
    scope.$digest();

    expect(directiveScope.checkSize(testSize)).toBeTruthy();
  });

  it('should check size with too large size', function() {
    var directiveScope = element.children().isolateScope();
    var testSize = 20000000000;
    scope.$digest();

    expect(directiveScope.checkSize(testSize)).toBeFalsy();
  });

  it('should check file type with valid type', function() {
    var directiveScope = element.children().isolateScope();
    var testFileType = 'application/json';
    scope.$digest();

    expect(directiveScope.isTypeValid(testFileType)).toBeTruthy();
  });

  it('should check file type with invalid type', function() {
    var directiveScope = element.children().isolateScope();
    var testFileType = 'bad-data-type';
    scope.$digest();

    expect(directiveScope.isTypeValid(testFileType)).toBeFalsy();
  });

  it('should remove file from allfiles', function() {
    var directiveScope = element.children().isolateScope();

    var testFiles = [
      {
        'file' : 'Test File 1 Data',
        'name' : 'Test File 1',
        'type' : 'application/json',
        'uploadDate' : '',
        'size' : 200000,
        'status' : '',
        'progress' : 0
      },
      {
        'file' : 'Test File 2 Data',
        'name' : 'Test File 2',
        'type' : 'application/json',
        'uploadDate' : '',
        'size' : 300000,
        'status' : '',
        'progress' : 0
      }
    ];

    directiveScope.allfiles = testFiles;
    directiveScope.removeUploadFile(0);
    scope.$digest();

    expect(directiveScope.allfiles.length).toEqual(1);
  });

  it('should return data transfer obj', function() {
    var directiveScope = element.children().isolateScope();
    var testEvent = {
      dataTransfer : 'test',
      effectAllowed : 'copy'
    };
    scope.$digest();

    expect(directiveScope.getDataTransfer(testEvent)).toEqual('test');
  });

  it('should return data transfer obj from originalEvent', function() {
    var directiveScope = element.children().isolateScope();
    var testEvent = {
      originalEvent : {
        dataTransfer : 'test'
      }
    };
    scope.$digest();

    expect(directiveScope.getDataTransfer(testEvent)).toEqual('test');
  });

  it('should check processDrageLeave function', function() {
    var directiveScope = element.children().isolateScope();
    directiveScope.dropElement = {
      removeClass : function(testClass) {return testClass;}
    };
    scope.$digest();

    expect(directiveScope.processDragLeave()).toEqual('drap_drop_active_hover');
  });

  it('should check processDragOverOrEnter function with event type 1', function() {
    var directiveScope = element.children().isolateScope();

    var testEvent = {
      preventDefault : function() { return true; },
      dataTransfer : 'test',
      effectAllowed : 'copy',
      originalEvent : {
        dataTransfer : 'test'
      }
    };

    directiveScope.dropElement = {
      addClass : function(testClass) {return testClass;}
    };
    scope.$digest();
    expect(directiveScope.processDragOverOrEnter(testEvent)).toEqual('drap_drop_active_hover');
  });

  it('should check processDragOverOrEnter function with event type 2', function() {
    var directiveScope = element.children().isolateScope();

    var testEvent = {
      stopPropagation : 'test',
      dataTransfer : 'test',
      effectAllowed : 'copy',
      originalEvent : {
        dataTransfer : 'test'
      }
    };

    directiveScope.dropElement = {
      addClass : function(testClass) {return testClass;}
    };
    scope.$digest();
    expect(directiveScope.processDragOverOrEnter(testEvent)).toBeFalsy();
  });

  it('should check processDragOverOrEnter function with event type 3', function() {
    var directiveScope = element.children().isolateScope();

    var testEvent = {
      dataTransfer : 'test',
      effectAllowed : 'copy',
      originalEvent : {
        dataTransfer : 'test'
      }
    };

    directiveScope.dropElement = {
      addClass : function(testClass) {return testClass;}
    };
    scope.$digest();
    expect(directiveScope.processDragOverOrEnter(testEvent)).toEqual('drap_drop_active_hover');
  });

  it('should add files with processDrop function', function() {
    var directiveScope = element.children().isolateScope();

    var testEvent = {
      preventDefault : function() { return true; },
      dataTransfer : 'test',
      effectAllowed : 'copy',
      originalEvent : {
        dataTransfer : 'test'
      }
    };

    directiveScope.allfiles = [];

    directiveScope.dropElement = {
      removeClass : function(testClass) {return testClass;}
    };

    directiveScope.getDataTransferFiles = function(testEvent) {
      var evt = testEvent;
      evt = 'testing';
      return [
        {
          'file' : 'Test File 1 Data',
          'name' : 'Test File 1',
          'type' : 'application/json',
          'uploadDate' : '',
          'size' : 200000,
          'status' : '',
          'progress' : 0
        },
        {
          'file' : 'Test File 2 Data',
          'name' : 'Test File 2',
          'type' : 'application/json',
          'uploadDate' : '',
          'size' : 300000,
          'status' : '',
          'progress' : 0
        }
      ];
    };

    scope.$digest();

    directiveScope.processDrop(testEvent);

    expect(directiveScope.allfiles.length).toEqual(2);
  });

  it('should add files with input multi field function', function() {
    var directiveScope = element.children().isolateScope();

    directiveScope.allfiles = [];

    directiveScope.inputElement = [
      {
        files : [{
          'file' : 'Test File 1 Data',
          'name' : 'Test File 1',
          'type' : 'application/json',
          'uploadDate' : '',
          'size' : 200000,
          'status' : '',
          'progress' : 0
        },
        {
          'file' : 'Test File 2 Data',
          'name' : 'Test File 2',
          'type' : 'application/zip',
          'uploadDate' : '',
          'size' : 300000,
          'status' : '',
          'progress' : 0
        }]
      }
    ];

    scope.$digest();

    directiveScope.uploadInputFiles();

    expect(directiveScope.allfiles.length).toEqual(2);
  });

  it('should test getDataTransferFiles function', function() {
    var directiveScope = element.children().isolateScope();
    var testEvent = {
      files : 'test file data'
    };
    scope.$digest();

    expect(directiveScope.getDataTransferFiles(testEvent)).toEqual('test file data');
  });

  it('should test loading start event function', function() {
    var directiveScope = element.children().isolateScope();
    var testFile = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'invalid-file-type',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    directiveScope.currentFileToAddEvents = testFile;

    var testEvent = {};

    scope.$digest();

    directiveScope.onLoadStartReader(testEvent);
  });

  it('should test loading progress event function', function() {
    var directiveScope = element.children().isolateScope();
    var testFile = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'invalid-file-type',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    directiveScope.currentFileToAddEvents = testFile;

    var testEvent = {
      loaded : 2000
    };

    scope.$digest();

    directiveScope.onProgressReader(testEvent);
  });

  it('should test onload event function', function() {
    var directiveScope = element.children().isolateScope();
    var testFile = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'invalid-file-type',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    directiveScope.currentFileToAddEvents = testFile;

    var testEvent = {
      target : {
        result : ''
      }
    };

    scope.$digest();

    directiveScope.onLoadReader(testEvent);
  });

  it('should test onloadend event function', function() {
    var directiveScope = element.children().isolateScope();
    var testFile = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'invalid-file-type',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    directiveScope.currentFileToAddEvents = testFile;
    directiveScope.currentAddToFileIndex = 0;
    directiveScope.allfiles = [testFile];
    var testEvent = {
      target : {
        result : ''
      }
    };

    scope.$digest();

    directiveScope.onLoadEndReader(testEvent);
  });

  it('should test onloadend event function does not add existing files', function() {
    var directiveScope = element.children().isolateScope();
    var testFile = {
      'file' : 'Test File 1 Data',
      'name' : 'Test File 1',
      'type' : 'application/json',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };
    var testFile2 = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'application/zip',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    directiveScope.currentFileToAddEvents = testFile;
    directiveScope.currentAddToFileIndex = 2;
    directiveScope.allfiles = [testFile, testFile2];
    var testEvent = {
      target : {
        result : ''
      }
    };

    scope.$digest();

    directiveScope.onLoadEndReader(testEvent);
  });

  it('should test onloadend event function does not add existing files', function() {
    var directiveScope = element.children().isolateScope();
    var testFile = {
      'file' : 'Test File 1 Data',
      'name' : 'Test File 1',
      'type' : 'application/json',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };
    var testFile2 = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'application/zip',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    directiveScope.currentFileToAddEvents = testFile;
    directiveScope.currentAddToFileIndex = 3;
    directiveScope.allfiles = [testFile, testFile2];
    var testEvent = {
      target : {
        result : ''
      }
    };

    scope.$digest();

    directiveScope.onLoadEndReader(testEvent);
  });

  it('should add loading events for an invalid file type', function() {
    var directiveScope = element.children().isolateScope();

    spyOn(window, 'FileReader').and.callFake(function() {
      var spiedObj = {
        readAsText: function(file) {
          return file;
        },
        readAsArrayBuffer: function(file) {
          return file;
        }
      };
      return spiedObj;
    });

    var testFile = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'invalid-file-type',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    directiveScope.allfiles = [testFile];
    directiveScope.currentAddToFileIndex = 0;

    scope.$digest();

    directiveScope.addLoadingEvents(testFile);
  });

  it('should add loading events for an invalid file type with multiple files', function() {
    var directiveScope = element.children().isolateScope();

    var testFile = {
      'file' : 'Test File 1 Data',
      'name' : 'Test File 1',
      'type' : 'invalid-file-type',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };
    var testFile2 = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'invalid-file-type',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    directiveScope.allfiles = [testFile, testFile2];
    directiveScope.currentAddToFileIndex = 0;

    scope.$digest();

    directiveScope.addLoadingEvents(testFile);
  });

  it('should add loading events for a valid file type(json)', function() {
    var directiveScope = element.children().isolateScope();

    var testFile = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'application/json',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    spyOn(window, 'FileReader').and.callFake(function() {
      var spiedObj = {
        readAsText: function(file) {
          return file;
        },
        readAsArrayBuffer: function(file) {
          return file;
        }
      };
      return spiedObj;
    });

    scope.$apply();
    scope.$digest();

    directiveScope.addLoadingEvents(testFile);
  });

  it('should add loading events for a valid file type(zip)', function() {
    var directiveScope = element.children().isolateScope();

    var testFile = {
      'file' : 'Test File 2 Data',
      'name' : 'Test File 2',
      'type' : 'application/zip',
      'uploadDate' : '',
      'size' : 300000,
      'status' : '',
      'progress' : 0
    };

    spyOn(window, 'FileReader').and.callFake(function() {
      var spiedObj = {
        readAsText: function(file) {
          return file;
        },
        readAsArrayBuffer: function(file) {
          return file;
        }
      };
      return spiedObj;
    });

    scope.$apply();
    scope.$digest();

    directiveScope.addLoadingEvents(testFile);
  });

});
