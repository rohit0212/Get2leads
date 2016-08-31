
/*************************Angular Js App ***********************************/

var app = angular.module('login',['UserValidation']);

app.controller('loginController',['$scope', '$rootScope',
    function($scope,$rootScope) {

        $scope.hideShowPanel = function(){
            $(".panel-home").toggleClass("hidden");
            $(".panel-home").toggleClass("animated");
            $(".panel-home").toggleClass("fadeInRight");
        }
        }]);

angular.module('UserValidation', []).directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.signupForm.password.$viewValue;
                //alert(noMatch);
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});