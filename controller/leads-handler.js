// load up the user model
var Lead = require('../model/lead');
var Comment = require('../model/Comment');
var mongoose     = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require('fs');
var User = require('../model/user');

module.exports= {

    publishNewLead : function( req, res, next) {
    	
        var newLead  = new Lead(req.body); //new Lead(req.body.newLead);
        newLead.createdBy = req.user._id;
        
        if( req.files.length>0){
        	// console.log(req.body);
            // console.log(req.files);               
             var dirname = require('path').dirname(__dirname);
             var fileName = req.files[0].filename;
             var mimeType = req.files[0].mimetype;
          
             try{
             var read_stream = fs.createReadStream(dirname + '\\uploads\\' + fileName);
             var gfs = Grid(mongoose.connection.db,mongoose.mongo);         
             var writestream = gfs.createWriteStream({
                filename: fileName
             });
             read_stream.pipe(writestream);
             }catch(e){ console.log("e--------------------"+e);}
            
             fs.unlink(dirname + '\\uploads\\' + fileName, function(err) {
            	 // if (err) throw err;
            	 // console.log('successfully deleted /tmp/hello');
            	});
             
            newLead.images.push({imageName : fileName, mimeType : mimeType , url : '/getImage/'+fileName});
        }      
        newLead.save(function(err,lead) {
            if (err)
                res.send({});
            else{
                Lead.findOne({_id:lead._id })
                    .populate('createdBy','local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.email  local.profileImageUrl') // <--
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
    
    
  getImage : function( req, res, next) {

 	 var imageName = req.params.imageName;  
 	 console.log("imageName---"+imageName);
 	 try{
 	 var gfs = Grid(mongoose.connection.db,mongoose.mongo);
 
       gfs.files.find({filename: imageName}).toArray(function (err, files) {     console.log("files---"+files);
        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            var mime = 'image/jpeg'; console.log("mime---"+mime);
            res.set('Content-Type', mime);
            var read_stream = gfs.createReadStream({filename: imageName});
            read_stream.pipe(res);
        } else {
            res.json('File Not Found');
        }
       
      });
     }catch(e){ res.json('Exception');}
 
    },

    profileImageUpload : function( req, res, next) {
    	//console.log('*******************************************************************************8');      
    	
        if( req.files.length>0){
              console.log(req.files);               
             var dirname = require('path').dirname(__dirname);
             var fileName = req.files[0].filename;
             var mimeType = req.files[0].mimetype;
          
             try{
             var read_stream = fs.createReadStream(dirname + '\\uploads\\' + fileName);
             var gfs = Grid(mongoose.connection.db,mongoose.mongo);         
             var writestream = gfs.createWriteStream({
                filename: fileName
             });
             read_stream.pipe(writestream);
             }catch(e){ console.log("e--------------------"+e);}
             
             
             User.findOneAndUpdate(
                     {_id: req.user._id},
                     {"local.profileImageUrl": '/getImage/'+fileName},
                     {safe: true, upsert: true, 'new' : true}
                     
                     ).exec(function(err, user) {
                         if (err){
                             req.profileImageUrl='';
                         }else{
                             req.imageUrl= user.local.profileImageUrl;
                         }

                         return next();
                     });
             

             fs.unlink(dirname + '\\uploads\\' + fileName, function(err) {
            	 // if (err) throw err;
            	 // console.log('successfully deleted /tmp/hello');
            	});
             
             User.findOne({ '_id' : req.user._id}, function(err, user) {
            	   
            	    // if no user is found, return the message
            	   // console.log("user -"+ user);
            	    if (user){
            	    // req.user=user;
            	     user.local.isVerified = true;
            	     user.save(function(err) {
            	      if (err) {
            	       console.log('error');
            	       res.redirect('/');
            	      }
            	      else
            	       return next();
            	     });
            	    }else{
            	        res.redirect('/');

            	    }

            	   });
            
        }      
      

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