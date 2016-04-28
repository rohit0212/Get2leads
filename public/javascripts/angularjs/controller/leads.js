/*************************Angular Js App ***********************************/
var app = angular.module('leadsApp',['btford.socket-io', 'UserValidation']);

app.factory('Socket',['socketFactory',function(socketFactory){	
	return socketFactory();
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('multipartForm', ['$http', function ($http) {
	
    this.post = function(uploadUrl, newLead, leads){
        var fd = new FormData();        
        for(var key in newLead){
        	fd.append(key, newLead[key]);
        }
        
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(responsedata, status, headers, config){
        	 leads.unshift( angular.fromJson(responsedata));
        	 newLead ={};
             $('#newPostModal').modal('toggle');
        	
        }) .error(function(responsedata, status, headers, config){
        });
    }
}]);


app.controller('leadsController',function($scope, $http, Socket, multipartForm){
	
	/**** Socket connection codestart *********/
	//open the socket connection
	 Socket.connect();
	 $scope.$watch('emailId',emailIdShow, true);
     function emailIdShow() {
    	 Socket.emit('join', {email: $scope.emailId});
     }
   
	//fire when business commented
	Socket.on('new_comment', function(data){ 
        $scope.leads.forEach(function(lead, index) {
        	if(lead._id == data.leadId){
        		lead.comments.push(angular.fromJson(data.comment));
        	}
            });	
	});
	
	//fire when user replied
    Socket.on('new_reply', function(data){      
        $scope.leads.forEach(function(lead, index) {
        	lead.comments.forEach(function(comment, index) {
            	if(comment._id == data.commentId){
            		comment.replies.push(angular.fromJson(data.reply));
            	}
            });
            });		
	});
	//close the connection when the page change
	$scope.$on('$locationChangeStart',function(event, next, current){	
		Socket.disconnect(true);
	});
	/**** Socket connection code end *********/
	
    $scope.subCategories={};
    $scope.leads = new Array();
    $scope.newLead ={};/* {
        category : 'house_service',
        subCategory : 'gardening',
        subject : 'my subject',
        priceRangeFrom: '$20',
        priceRangeTo : '$30',
        activeStatus : 'active',
        fromDate : '4/21/2016',
        toDate  :  '4/21/2016',
        country: 'usa',
        zipCode: '208012',
        limit: '30',
        detail:'my detail'
    };*/

    $scope.publishNewLead = function(){
    	
    	multipartForm.post('/publishNewLead',$scope.newLead, $scope.leads);
    	/*
        $http({
            url: "/publishNewLead",
            method: "POST",
            data: { newLead : $scope.newLead},
        }).success(function(data, status, headers, config) {
            $scope.leads.unshift( angular.fromJson(data));
            $scope.newLead ={};
            $('#newPostModal').modal('toggle');
           // $('#messageModal').find('.modal-body').html(data);
           // $('#messageModal').modal('toggle'); //$scope.data = data;

        }).error(function(data, status, headers, config) {
        });
    */};

    $scope.getLeads = function(){
        $http({
            url: "/getLeads",
            method: "GET",
        }).success(function(data, status, headers, config) {
            var userLeads = angular.fromJson(data);
            $scope.leads = userLeads;
            
        }).error(function(data, status, headers, config) {

        });
    };
    $scope.getLeads();

    $scope.getSubCategory = function(category){
        $http({
            url: "/getSubCategory",
            method: "GET",
            params : {category: category}
        }).success(function(data, status, headers, config) {
            var data = angular.fromJson(data);
            $scope.subCategories = data;            
        }).error(function(data, status, headers, config) {

        });
    };

    $scope.saveComment = function(lead){
        $http({
            url: "/saveComment",
            method: "POST",
            data: { leadId : lead._id ,comment : lead.addComment},
        }).success(function(data, status, headers, config) {
        	data = angular.fromJson(data);
            lead.comments.push(data);
            lead.addComment ="";
            Socket.emit('comment', {email: lead.createdBy.local.email, leadId : lead._id, comment : data});


        }).error(function(data, status, headers, config) {
        });
    };
    $scope.saveReply= function(comment , leadCreatedMailId){ 
        $http({
            url: "/saveReply",
            method: "POST",
            data: { commentId : comment._id ,replyComment : comment.addReply},
        }).success(function(data, status, headers, config) {
        	data = angular.fromJson(data);
            comment.replies.push(data);
            comment.addReply = "";
            
            var emitToMail = comment.createdBy.local.email+""+leadCreatedMailId;
            emitToMail = emitToMail.replace(data.createdBy.local.email, "")           
            Socket.emit('reply', {email: emitToMail, commentId : comment._id, reply : data});

        }).error(function(data, status, headers, config) {
        });
    };
    
    
    $scope.focusToComments= function(comment){ 
    document.getElementById(comment).focus();
    };
    
});

