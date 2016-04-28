
/*************************Angular Js App ***********************************/

var app = angular.module('profile',['UserValidation']);

app.directive('profileImageModel', ['$parse', '$http',function ($parse, $http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                   // modelSetter(scope, element[0].files[0]);
                    

                    var fd = new FormData(); 
                    fd.append('profileImage', element[0].files[0]);
                    
                    $http.post('/profileImageUpload', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function(responsedata, status, headers, config){
                    	// alert();
                    	document.getElementById('profile-pic').src = responsedata;
                    	
                    }) .error(function(responsedata, status, headers, config){
                    });
                
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                });
            });
        }
    };
}]);

app.controller('profileController',function($scope,$http){
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


});

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