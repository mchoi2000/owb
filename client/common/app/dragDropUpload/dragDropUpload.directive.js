//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.dragDropUpload', []);

  angular.module('common.dragDropUpload')
         .directive('pwbDragDropUpload', [dragDropUploadDirective]);

  function dragDropUploadDirective() {
    return {
      require: ['ngModel', '^form'],
      restrict: 'EA',
      scope: {
        allfiles: '=ngModel',
        onLoad: '&',
        onDelete: '&',
        onError: '='
      },
      templateUrl: 'common/app/dragDropUpload/dragDropUpload.html',
      priority: 100,
      link: function(scope, element, attrs, ctrl) {
        scope.form = ctrl[1];

        var name, size, type;

        var validMimeTypes = ['application/zip',
                      'application/json',
                      'application/x-zip-compressed',
                      'application/x-compressed',
                      'multipart/x-zip'
                    ];
        var maxFileSize = 20;

        scope.dropElement = element.find('#drag-drop-container');
        scope.inputElement = element.find('#input_add_files');

        scope.currentAddToFileIndex = 0;
        scope.currentFileToAddEvents = '';

        scope.$watch('allfiles', function(value) {
          if (value !== undefined && value.length === 0) {
            scope.currentAddToFileIndex = 0;
            scope.currentFileToAddEvents = '';
            name = '';
            size = '';
            type = '';
          }
        });

        scope.getDataTransfer = function(event) {
          return event.dataTransfer || event.originalEvent.dataTransfer;
        };

        scope.getDataTransferFiles = function(transferEvent) {
          return transferEvent.files;
        };

        scope.processDragOverOrEnter = function(event) {
          if (event.preventDefault) {
            event.preventDefault();
            return scope.dropElement.addClass('drap_drop_active_hover');
          }
          if (event.stopPropagation) {
            return false;
          }
          return scope.dropElement.addClass('drap_drop_active_hover');
        };

        scope.processDragLeave = function() {
          return scope.dropElement.removeClass('drap_drop_active_hover');
        };

        scope.processDrop = function(event) {
          event.preventDefault();
          scope.dropElement.removeClass('drap_drop_active_hover');

          var files = scope.getDataTransferFiles(scope.getDataTransfer(event));

          scope.addUploadedFiles(files);

          scope.$apply(function() {
            return scope.allfiles;
          });
        };

        scope.dropElement.bind('dragover', scope.processDragOverOrEnter);
        scope.dropElement.bind('dragover', scope.processDragOverOrEnter);
        scope.dropElement.bind('dragenter', scope.processDragOverOrEnter);
        scope.dropElement.bind('dragleave', scope.processDragLeave);
        scope.dropElement.bind('drop', scope.processDrop);

        // Checks file size
        scope.checkSize = function(size) {
          if (size / 1024 / 1024 < maxFileSize) {
            return true;
          } else {
            return false;
          }
        };

        // Checks valid file type
        scope.isTypeValid = function(type) {
          if (validMimeTypes.indexOf(type) > -1) {
            return true;
          }
          return false;
        };

        // Adds files from the input file upload
        scope.uploadInputFiles = function() {
          var files = scope.inputElement[0].files;
          scope.addUploadedFiles(files);
          return false;
        };

        // Removes files
        scope.removeUploadFile = function(index) {
          scope.allfiles.splice(index, 1);
          scope.currentAddToFileIndex = scope.allfiles.length;
          scope.onDelete();
        };

        // Adds uploadedFiles to scope.allfiles and adds Load events
        scope.addUploadedFiles = function (files) {
          for (var i = 0; i < files.length; i++) {
            var newUploadAllFile = {
              'file' : files[i],
              'name' : files[i].name,
              'type' : files[i].type,
              'uploadDate' : '',
              'size' : files[i].size,
              'status' : 'inComplete',
              'progress' : 0
            };
            scope.allfiles.push(newUploadAllFile);
          }
          scope.addLoadingEvents(scope.allfiles[scope.currentAddToFileIndex]);
        };

        scope.onLoadStartReader = function(evt) {
          scope.currentFileToAddEvents.status =  'starting';
          scope.$apply();
        };

        scope.onProgressReader = function(evt) {
          scope.currentFileToAddEvents.progress =  evt.loaded;
          scope.$apply();
        };

        scope.onLoadReader = function(evt) {
          scope.currentFileToAddEvents.file = evt.target.result;
          scope.currentFileToAddEvents.status =  'processing';
          scope.currentFileToAddEvents.progress =  size;
          scope.$apply();
        };

        scope.onLoadEndReader = function(evt) {
          scope.currentFileToAddEvents.file = evt.target.result;
          scope.currentFileToAddEvents.status =  'complete';
          scope.currentFileToAddEvents.uploadDate = new Date();
          scope.currentFileToAddEvents.progress =  size;
          scope.currentFileToAddEvents.uploadDate =  new Date();
          scope.$apply();

          if ((scope.currentAddToFileIndex) < scope.allfiles.length) {
            // If not at the end, add Loading events to the next file in allfiles
            scope.addLoadingEvents(scope.allfiles[scope.currentAddToFileIndex]);
          } else if ((scope.currentAddToFileIndex) === scope.allfiles.length) {
            scope.onLoad();
          }
        };

        scope.getNewFileReader = function () {
          return new FileReader();
        };

        // Adds loading events and updates scope.allfiles
        scope.addLoadingEvents = function (file) {
          name = file.name;
          type = file.type;
          size = file.size;

          var uploadedFile = file.file;

          if (!scope.checkSize(size) || !scope.isTypeValid(type)) {
            file.status =  'inValid';
            file.progress =  size;
            scope.onError = true;
            scope.$apply();

            scope.currentAddToFileIndex++;

            if ((scope.currentAddToFileIndex) < scope.allfiles.length) {
              scope.addLoadingEvents(scope.allfiles[scope.currentAddToFileIndex]);
            }

          }
          else {
            var reader = scope.getNewFileReader();
            if (type === 'application/json') {
              reader.readAsText(uploadedFile);
            } else {
              reader.readAsArrayBuffer(uploadedFile);
            }
            scope.currentFileToAddEvents = file;

            scope.currentAddToFileIndex++;

            reader.onloadstart = scope.onLoadStartReader;
            reader.onprogress = scope.onProgressReader;
            reader.onload = scope.onLoadReader;
            reader.onloadend = scope.onLoadEndReader;

          }

        };

      }
    };
  }
})();
