$(document).ready(function() {
   /*============= Chat sidebar ==============================*/
  $('.chat-sidebar, .nav-controller, .chat-sidebar a').on('click', function(event) {
      $('.chat-sidebar').toggleClass('focus');
  });

  $(".hide-chat").click(function(){
      $('.chat-sidebar').toggleClass('focus');
  });

    //comment this code if you want to show chat
    $('.chat-sidebar').toggleClass('focus');


  /*============= About page ==================================*/
  $(".about-tab-menu .list-group-item").click(function(e) {
      e.preventDefault();
      $(this).siblings('a.active').removeClass("active");
      $(this).addClass("active");
      var index = $(this).index();
      $("div.about-tab>div.about-tab-content").removeClass("active");
      $("div.about-tab>div.about-tab-content").eq(index).addClass("active");
  });

  /*==============  show login and register panel ===============*/
  $(".btn-panel-home").click(function(){
    $(".panel-home").toggleClass("hidden");
    $(".panel-home").toggleClass("animated");
    $(".panel-home").toggleClass("fadeInRight");
  });

  /*============== show image in modal when click =================*/
  $('img.show-in-modal').click(function(e){
    $('.photo-modal .img-content').attr('src', $(this).attr('src'));
    $('.photo-modal').modal('show');
    e.preventDefault();
  });

  $('a.show-in-modal').click(function(e){
    $('.photo-modal .img-content').attr('src', $(this).find('img:first').attr('src'));
    $('.photo-modal').modal('show');
    e.preventDefault();
  });

  //fade in cover photos
  setInterval(function(){
    cycleimages($('#cycler1'))
  }, 5000);

    //--------------------------------------------
    // for select place holder color change
    $('select').change(function() {
        if ($(this).children('option:first-child').is(':selected')) {
            $(this).addClass('placeholder');
        } else {
            $(this).removeClass('placeholder');
        }
    });

    $('.datetimepicker').datetimepicker({
        format:'M/D/YYYY'
    });
   window.setTimeout(function() { $('#cPassword').val('')  }, 200);
})

function cycleimages(container){
  var $active = container.find('.active');
  $next = ($active.next().length > 0) ? $active.next() : container.find('.comp-photo:first');
  $next.css('z-index',2);//move the next image up the pile
  $active.fadeOut(1500,function(){//fade out the top image
  $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
  $next.css('z-index',3).addClass('active');//make the next image the top one
  });
}

//mantein cover header height
$(window).on('resize', function(){
  $('.feed-header').css('height',$('.comp-photo3').height());
});






























/*************************Angular Js App ***********************************/

var editProfileApp = angular.module('editprofile',['UserValidation']);

editProfileApp.controller('editProfileController',function($scope,$http){
    $scope.panel = {
         contactDetail : true,
         businessDetail : false,
         leadCategory: false,
         changePassword : false,
         commPreferences : false
    },
        
    $scope.passwords = {
        cPassword: '',
        nPassword: '',
        confPassword : ''
    },
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
    },
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
    }
    $scope.commPrefences='sms',

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

    } ,
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
    },

        $scope.updatePreferences = function(){
            $http({
                url: "/updatePreferences",
                method: "POST",
                data: { commPreferences : $scope.commPrefences},
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
        },

        $scope.updateContactDetails = function(){
            $http({
                url: "/updateContactDetails",
                method: "POST",
                data: { contactDetails : $scope.contactDetails},
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
        },

        $scope.updateBusinessDetails = function(){
            $http({
                url: "/updateBusinessDetails",
                method: "POST",
                data: { businessDetails : $scope.businessDetails},
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