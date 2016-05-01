/*************************Angular Js App ***********************************/
var app = angular.module('leadsApp',['btford.socket-io','ngFileUpload','cloudinary']);
app.config(['cloudinaryProvider', function (cloudinaryProvider) {
	  cloudinaryProvider
	      .set("cloud_name", "dx9c5y0vp")
	      .set("upload_preset", "xpy97beo");
	}]);

app.factory('Socket',['socketFactory',function(socketFactory){	
	return socketFactory();
}]);


app.controller('leadsController',['$scope', '$http', 'Socket','Upload','cloudinary', 
       function($scope, $http, Socket, $upload,cloudinary){
	

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
    $scope.newLead ={
    		images : []
    };
    $scope.fullViewImges= [];
    
    $scope.uploadLeadImages = function(files){ //alert(2);
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
	            	  
	            	  $scope.newLead.images.push({
	            	        url : imageData.secure_url
	            	     });
	              }).error(function (data, status, headers, config) {
	              // file.result = data;
	              });
	        	        	
	        }
	      });
	    };

    $scope.publishNewLead = function(){
    	
        $http({
            url: "/publishNewLead",
            method: "POST",
            data: { newLead : $scope.newLead},
        }).success(function(data, status, headers, config) {
            $scope.leads.unshift( angular.fromJson(data));
            $scope.newLead ={images : []};
            $('#newPostModal').modal('toggle');
           // $('#messageModal').find('.modal-body').html(data);
           // $('#messageModal').modal('toggle'); //$scope.data = data;

        }).error(function(data, status, headers, config) {
        });
    };

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
    
    $scope.showImageFUllView = function(images){ 
    	$scope.fullViewImges = images;
    	$('#imageFullViewModel').modal('toggle');
        };
    
    
    
    
}]);

