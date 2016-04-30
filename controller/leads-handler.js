// load up the user model
var Lead = require('../model/lead');
var Comment = require('../model/Comment');
var mongoose     = require('mongoose');

module.exports= {

    publishNewLead : function( req, res, next) {
        var newLead  = new Lead(req.body.newLead);
        newLead.createdBy = req.user._id;
        newLead.save(function(err,lead) {
            if (err)
                res.send({});
            else{
                Lead.findOne({_id:lead._id })
                    .populate('createdBy','local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.email local.profileImageUrl') // <--
                    .exec(function (err, lead) {
                        var  resMessage = "";
                        if (lead){
                            res.send(lead);
                        }else{
                            res.send({});
                        }
                    });
            }
        });

    },
    
 
    getLeads : function( req, res, next) {    	
    	
    	if(req.user.local.userType == "business" ){	
		        Lead.find({}).sort({'createdDate': 'desc'})		            
		            .populate('createdBy','local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.email local.profileImageUrl')
		            .populate({
						  path: 'comments',
						  match: { createdBy: req.user._id },
						  select: 'comment createdBy createdDate replies',
						 // options: { limit: 5 },
						  populate: [{
					           path: 'createdBy',
					           select: 'local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.email local.profileImageUrl'
					             },
					             {
						           path: 'replies.createdBy',
						           select: 'local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.profileImageUrl'
						        }]
						})		            
		            .exec(function (err, leads) {
		            if (leads){
		                res.send(leads);
		            }else{
		                res.send({});
		            }
		        });        
        
    	}else{
    		// console.log("req.user.local.userType 2-"+req.user.local.userType);
    		 Lead.find({ createdBy : req.user._id}).sort({'createdDate': 'desc'})
	            .populate('createdBy','local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.email local.profileImageUrl')
	            .populate({
				  path: 'comments',
				  select: 'comment createdBy createdDate replies',
				 // options: { limit: 5 },
				  populate: [{
				           path: 'createdBy',
				           select: 'local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.email local.profileImageUrl'
				        },
				         {
					           path: 'replies.createdBy',
					           select: 'local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.profileImageUrl'
					        }]
				})
	           
	            .exec(function (err, leads) {
	            if (leads){
	                res.send(leads);
	            }else{
	                res.send({});
	            }
	        });     		
    		
    	}
        
        
        
        
        
    },

    saveComment : function( req, res, next) {       
        var newComment = new Comment({ comment:req.body.comment, createdBy: req.user._id});        
        newComment.save(function(err,comment) {
            if (err)
            	 req.comments={};
            else{
                Lead.findOneAndUpdate(
                    {_id: req.body.leadId},
                    {$push: {"comments": comment._id}},
                    {safe: true, upsert: true, 'new' : true}
                    )
                    .populate({
      				  path: 'comments',
      				  match: { _id: comment._id},
    				  select: 'comment createdBy createdDate replies',
    				  populate: {
    				           path: 'createdBy',
    				           select: 'local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.email local.profileImageUrl',
    				        }
    				})
                    .exec(function(err, lead) {
                       // console.log("err----------------"+lead);
                        if (err){
                            req.comments={};
                        }else{
                            req.comments=lead.comments[0];
                        }

                        return next();
                    });
            }
        });        

    },

    saveReply : function( req, res, next) {
        var replies  = {};
        replies.replyComment =  req.body.replyComment;
        replies.createdBy = req.user._id;
        

        Comment.findOneAndUpdate(
            {_id: req.body.commentId},
            {$push: {"replies": replies}},
            {safe: true, upsert: true, 'new' : true}
            )
             .populate('replies.createdBy','local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.email local.profileImageUrl')
            .exec(function(err, comment) {
                if (err){
                    req.replies={};
                }else{
                    req.replies=comment.replies[comment.replies.length-1];
                }

                return next();
            });

    }

}