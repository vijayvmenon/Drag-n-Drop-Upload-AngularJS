var app = angular.module('plunker', ['ngFileUpload','angularFileUpload','filereader']);



app.controller('MainCtrl',function($scope,FileUploader,FileReader) {

  var encoding="";
  $scope.showAlert=false;
  //pattern to validate csv
  $scope.csvPattern = /^[0-9]+(?:,?[0-9]+)*$/;

   var uploader = $scope.uploader = new FileUploader();

        // FILTERS
      
        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter' + this.queue.length);
                return this.queue.length < 1;
            }
        });
      
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });


uploader.allowNewFiles = true;
uploader.filters.push({
  name:'csvfilter',
  fn: function() {
    return this.allowNewFiles;
}
});


  //Function to clear the data in the file uploader and textarea

  $scope.clearData = function() {
    console.log(uploader.queue)
    uploader.clearQueue();
    $scope.fileData="";
    $scope.showAlert=false;
  }

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
            $scope.showAlert=true;
        };


        uploader.onAfterAddingFile = function(fileItem) {
            console.log(uploader.queue);
            console.log(uploader.queue[0].file.name);

            var dataFile=fileItem._file;
     FileReader.readAsText(dataFile,encoding, $scope)
         .then(function (resp) {
        console.log(resp);
        var resp=resp.replace(/\n/g,',');
        var resp_formatted=resp.replace(/\s+/g,'');
        $scope.fileData=resp_formatted;

    }, function (err) {
        // Do stuff
    });

  };

        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

});

