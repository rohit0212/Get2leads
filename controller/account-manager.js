// load up the user model
var User = require('../model/user');
var emailDispatcher= require('../controller/email-dispatcher');

module.exports= {

  verifyAccount : function( req, res, next) {
   // find a user whose email is the same as the forms email
   // we are checking to see if the user trying to login already exists
   User.findOne({ 'local.email' :  req.param('e'),'local.password' :  req.param('p') }, function(err, user) {
   
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

 },

 forgotPassword : function( req, res, next) {  //console.log("********************************************************");
  // find a user whose email is the same as the forms email
  User.findOne({ 'local.email' :  req.param('email')}, function(err, user) {

   //console.log("user -"+ user);
   if (user){
         emailDispatcher.dispatchForgotPasswordLink(user,req.protocol + "://" + req.get('host'), function(e, m){
         // this callback takes a moment to return //
         // TODO add an
         // ajax loader to give user feedback //
        if (!e){
          // console.log('forgot password mail send');
           res.render('forgotpassword.ejs', { message: 'Mail sent succesfully, Please Check your email', sentMail:true });
        }else{
           // for (k in e) console.log('ERROR : ', k, e[k]);
          //  console.log('unable to dispatch password reset');
            res.render('forgotpassword.ejs', { message: 'There is some error please try again later.', sentMail:false });
        }
       });
   }else{
        //console.log("--------------------------------------------------------");
        res.render('forgotpassword.ejs', { message: 'No account with that e-mail address exists.', sentMail:false });

   }

  });

 },
    
    resetpassword : function( req, res, next) {  //console.log(req.param("password")+"****************************************"+ req.param('token'));
        // find a user whose email is the same as the forms email
        User.findOne({ 'local.password' :  req.param('token')}, function(err, user) {

            // if no user is found, return the message
            // console.log("user -"+ user);
            if (user){
                // req.user=user;
                user.local.password = user.generateHash(req.param("password"));
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

    },

    updateProfilePic : function( req, res, next) {
        User.findOneAndUpdate(
                {_id: req.user._id},
                {"local.profileImageUrl": req.body.imageUrl},
                {safe: true, upsert: true, 'new' : true}
                
                ).exec(function(err, user) {
                    if (err){
                        req.profileImageUrl='';
                    }else{
                        req.imageUrl= user.local.profileImageUrl;
                    }

                    return next();
                });          
     
    },
    updatepassword : function( req, res, next) {
        User.findOne({ '_id' : req.user._id}, function(err, user) {
          var  resMessage = "";
          if (user &&  user.validPassword(req.body.passwords.cPassword)){
                // req.user=user;
                user.local.password = user.generateHash(req.body.passwords.nPassword);
                user.save(function(err) {
                    if (err) {
                        console.log('error');
                        resMessage = "There is some error occurred.";
                    }
                    else
                        resMessage = "Password changed successfully";

                    res.send(resMessage);
                });
            }else{
              res.send( "There is some error occurred.");
            }

        });
    },

    updatePreferences : function( req, res, next) {
              User.findOne({ '_id' : req.user._id}, function(err, user) {
            var  resMessage = "";
            if (user){
                // req.user=user;
                user.local.userDetails.commPreferences = req.body.commPreferences;
                user.save(function(err) {
                    if (err) {
                        console.log('error');
                        resMessage = "There is some error occurred 1.";
                    }
                    else
                        resMessage = "Communication Preferences updated successfully";
                        res.send(resMessage);
                });
            }else{
                res.send( "There is some error occurred. 1");
            }
        });
    },

    updateContactDetails : function( req, res, next) {

        User.findOne({ '_id' : req.user._id}, function(err, user) {
            var  resMessage = "";
            if (user){
                // req.user=user;
                user.local.userDetails.contactDetails = req.body.contactDetails;
                user.local.firstName = req.body.contactDetails.firstName;
                user.local.lastName = req.body.contactDetails.lastName;
                user.save(function(err) {
                    if (err) {
                        console.log('error');
                        resMessage = "There is some error occurred.";
                    }
                    else
                        resMessage = "Contact Details updated successfully";

                    res.send(resMessage);
                });
            }else{
                res.send( "There is some error occurred.");
            }
        });
    },

    updateBusinessDetails : function( req, res, next) {

        User.findOne({ '_id' : req.user._id}, function(err, user) {
            var  resMessage = "";
            if (user){
                user.local.userDetails.businessDetails = req.body.businessDetails;
                user.save(function(err) {
                    if (err) {
                        console.log('error');
                        resMessage = "There is some error occurred.";
                    }
                    else
                        resMessage = "Business Details updated successfully";

                    res.send(resMessage);
                });
            }else{
                res.send( "There is some error occurred.");
            }
        });
    },

    getUserData : function( req, res, next) {

        User.findOne({ '_id' : req.user._id}, function(err, user) {
            var  resMessage = "";
            if (user){
                    res.send(user.local.userDetails);
            }else{
                res.send( "There is some error occurred.");
            }
        });
    }


}