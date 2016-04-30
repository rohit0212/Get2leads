
/*************************Angular Js App ***********************************/

var app = angular.module('profile',['UserValidation','ngFileUpload','cloudinary']);

app.config(['cloudinaryProvider', function (cloudinaryProvider) {
	  cloudinaryProvider
	      .set("cloud_name", "dx9c5y0vp")
	      .set("upload_preset", "xpy97beo");
	}]);


app.controller('profileController',['$scope', '$rootScope', '$http', 'Upload','cloudinary', 
   function($scope,$rootScope, $http,  $upload,cloudinary) {
   
   $scope.uploadProfilePic = function(files){ //alert(2);
	      $scope.files = files;
	      if (!$scope.files) return;
	      angular.forEach(files, function(file){//alert(3);
	        if (file && !file.$error) {
	        	//alert(4);
	        	
	        	
	        	file.upload = $upload.upload({
	                url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
	                data: {
	                  upload_preset: cloudinary.config().upload_preset,
	                  tags: 'myphotoalbum',
	                  context: 'photo=' + $scope.title,
	                  file: file
	                }
	              }).progress(function (e) {
	               // file.progress = Math.round((e.loaded * 100.0) / e.total);
	               // file.status = "Uploading... " + file.progress + "%";
	              }).success(function (imageData, status, headers, config) {
	            	  $http({
	                      url: "/updateProfilePic",
	                      method: "POST",
	                      data: { imageUrl : imageData.url},
	                  }).success(function(data, status, headers, config) {
	                	  document.getElementById('profile-pic').src = imageData.url;
	                	  
	                  }).error(function(data, status, headers, config) {
	                	  
	                  });
	            	  
	                    
	              
	              }).error(function (data, status, headers, config) {
	              // file.result = data;
	              });
	        	        	
	        }
	      });
	    };
   
      
    $scope.panel = {
        contactDetail : true,
        businessDetail : false,
        leadCategory: false,
        changePassword : false,
        commPreferences : false
    };

        $scope.passwords = {
            cPassword: '',
            nPassword: '',
            confPassword : ''
        };

        $scope.contactDetails    = {
            firstName      :   '',
            lastName       :   '',
            contactPhone   :   '',
            sex            :   '',
            dob            : {
                month    :   '',
                date     :   '',
                year     :   ''
            },
            address1      :   '',
            address2      :   '',
            sex           :   '',
            city          :   '',
            postalCode    :   '',
            country       :   ''
        };
        $scope.businessDetails   = {
            aboutBusiness      :   '',
            companyName        :   '',
            address1           :   '',
            address2           :   '',
            city               :   '',
            postalCode         :   '',
            country            :   '',
            primaryPhone       :   '',
            secondryPhone      :   '',
            fax                :   '',
            website            :   ''
        };

        $scope.commPrefences='sms';

        $scope.getUserData = function(){
            $http({
                url: "/getUserData",
                method: "GET",
            }).success(function(data, status, headers, config) {
                var userDetails = angular.fromJson(data);

                for(detail in userDetails){
                    switch(detail){
                        case 'contactDetails' :  $scope.contactDetails = userDetails.contactDetails;
                            break;
                        case 'businessDetails' : $scope.businessDetails = userDetails.businessDetails;
                            break;
                        case 'commPreferences' : $scope.commPrefences = userDetails.commPreferences;

                            break;
                        default :
                              break;
                    }

                }
               // alert(x);
                //alert(x .businessDetails.website)
            }).error(function(data, status, headers, config) {

            });
        };
        $scope.getUserData();

        $scope.hideShowPanel = function (panelName) {
            switch(panelName){
                case 'contactDetail' :  $scope.panel = {
                    contactDetail : true,
                    businessDetail : false,
                    leadCategory: false,
                    changePassword : false,
                    commPreferences : false
                };
                    break;
                case 'businessDetail' :  $scope.panel = {
                    contactDetail : false,
                    businessDetail : true,
                    leadCategory: false,
                    changePassword : false,
                    commPreferences : false
                };
                    break;
                case 'leadCategory' :  $scope.panel = {
                    contactDetail : false,
                    businessDetail : false,
                    leadCategory: true,
                    changePassword : false,
                    commPreferences : false
                };
                    break;
                case 'changePassword' :  $scope.panel = {
                    contactDetail : false,
                    businessDetail : false,
                    leadCategory: false,
                    changePassword : true,
                    commPreferences : false
                };
                    break;
                case 'commPreferences' :  $scope.panel = {
                    contactDetail : false,
                    businessDetail : false,
                    leadCategory: false,
                    changePassword : false,
                    commPreferences : true
                };
                    break;
                default :    $scope.panel = {
                    contactDetail : true,
                    businessDetail : false,
                    leadCategory: false,
                    changePassword : false,
                    commPreferences : false
                };
                    break;
            }

        } ;

        $scope.updatePassword = function(){
            $http({
                url: "/updatepassword",
                method: "POST",
                data: { passwords : $scope.passwords},
            }).success(function(data, status, headers, config) {
                $('#messageModal').find('.modal-body').html(data);
                $('#messageModal').modal('toggle'); //$scope.data = data;

                $scope.passwords = {
                    cPassword:    '',
                    nPassword: '',
                    confPassword : ''
                }

            }).error(function(data, status, headers, config) {
                //$scope.status = status;
                $('#messageModal').find('.modal-body').html(data);
                $('#messageModal').modal('toggle')
            });
        };

        $scope.updatePreferences = function(){
            $http({
                url: "/updatePreferences",
                method: "POST",
                data: { commPreferences : $scope.commPrefences},
            }).success(function(data, status, headers, config) {
                $('#messageModal').find('.modal-body').html(data);
                $('#messageModal').modal('toggle'); //$scope.data = data;

            }).error(function(data, status, headers, config) {
                //$scope.status = status;
                $('#messageModal').find('.modal-body').html(data);
                $('#messageModal').modal('toggle')
            });
        };

        $scope.updateContactDetails = function(){
            $http({
                url: "/updateContactDetails",
                method: "POST",
                data: { contactDetails : $scope.contactDetails},
            }).success(function(data, status, headers, config) {
                $('#messageModal').find('.modal-body').html(data);
                $('#messageModal').modal('toggle'); //$scope.data = data;

            }).error(function(data, status, headers, config) {
                //$scope.status = status;
                $('#messageModal').find('.modal-body').html(data);
                $('#messageModal').modal('toggle')
            });
        };

        $scope.updateBusinessDetails = function(){
            $http({
                url: "/updateBusinessDetails",
                method: "POST",
                data: { businessDetails : $scope.businessDetails},
            }).success(function(data, status, headers, config) {
                $('#messageModal').find('.modal-body').html(data);
                $('#messageModal').modal('toggle'); //$scope.data = data;

              
            }).error(function(data, status, headers, config) {
                //$scope.status = status;
                $('#messageModal').find('.modal-body').html(data);
                $('#messageModal').modal('toggle')
            });
        }


}]);

angular.module('UserValidation', []).directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.changePassForm.nPassword.$viewValue;
                //alert(noMatch);
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});