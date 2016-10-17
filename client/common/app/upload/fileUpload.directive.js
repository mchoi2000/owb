//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2015 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
(function() {
  'use strict';

  angular.module('common.upload', ['ngFileUpload']);

  angular.module('common.upload').directive('pwbFileUpload', ['Upload', fileUploadDirective]);

  function fileUploadDirective(Upload) {
    return {
      restrict: 'E',
      require: ['^form'],
      scope: {
        label: '@',
        description: '@',
        inputId: '@',
        inputName: '@',
        types: '@',
        sizeLimit: '@',
        model: '=',
        validHeight: '@',
        validWidth: '@',
        existingData: '@',
        overwriteName: '@?',
        isRequired: '<'
      },
      templateUrl: 'common/app/upload/fileUpload.html',
      transclude: true,

      link: function(scope, elm, attrs, ctrl) {

        //Bind the parent form to the scope
        scope.form = ctrl[0];

        scope.removeFile = function() {
          scope.form[scope.inputName].$setViewValue(undefined);
          scope.form[scope.inputName].$setValidity('validAspect', true);
          scope.form[scope.inputName].$setValidity('maxSize', true);
          scope.form[scope.inputName].$setValidity('pattern', true);
        };

        //If there is a existing file set the model of the directive
        var unwatch = scope.$watch('existingData', function(newValue) {
          if (newValue) {
            scope.form[scope.inputName].$setViewValue(parseCDNFileName(scope.existingData));
            unwatch();
          }
        });

        scope.checkImage = function(file) {
          if (file) {
            Upload.imageDimensions(file)
              .then(function dimensionCallback(dimensions) {

                var widthCal =
                  Math.round((dimensions.width / dimensions.height) * scope.validHeight);
                // jshint eqeqeq: false
                if (dimensions.width >= scope.validWidth &&
                  dimensions.height >= scope.validHeight &&
                  parseInt(widthCal) == scope.validWidth) {

                  //set form validity to true
                  scope.form[scope.inputName].$setValidity('validAspect', true);

                  //If a name was passed than overwrite the filename
                  if (scope.overwriteName) {
                    var changedFile = Upload.rename(file, forceFileName(file.name));

                    //The name displayed will be original filename until form is submitted
                    changedFile.filename = changedFile.name;
                    changedFile.filetype = changedFile.type;

                    scope.form[scope.inputName].$setViewValue(changedFile);
                  } else {
                    file.filename = file.name;
                    file.filetype = file.type;
                    scope.form[scope.inputName].$setViewValue(file);
                  }
                } else {
                  //Set form validity to false
                  scope.form[scope.inputName].$setValidity('validAspect', false);
                  // Clear model for invalid aspect
                  scope.form[scope.inputName].$setViewValue(undefined);
                }
              });
          }
        };

        function parseCDNFileName(cdnUrl) {
          var result = {};
          result.filename = cdnUrl.substring(cdnUrl.lastIndexOf('/') + 1);
          result.url = cdnUrl;
          return result;
        }

        function forceFileName(fileName) {
          return scope.overwriteName + fileName.substring(fileName.indexOf('.'));
        }
      }
    };
  }

})();
