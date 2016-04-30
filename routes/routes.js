var accountManager = require('../controller/account-manager');
var leadHandler = require('../controller/leads-handler');
var Categories = require('../model/data/category');
var mongoose     = require('mongoose');

module.exports = function(app, passport) {

    // HOME PAGE (with login links)=========
    app.get('/', function(req, res) {
        res.render('signup.ejs', { message: req.flash('loginMessage'),page:'login' });
    });


    // show the login form============
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('loginMessage'),page:'login' });
    });

    // process the login form=====================
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    // logout action============
    app.get('/logout', function(req, res) {
    	 req.logout();
    	 res.redirect('/login');
    });
    
    // SIGNUP ==============================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        console.log("function signup");
        res.render('signup.ejs', { message: req.flash('signupMessage'),page:'signup' });
    });

    // process the signup form=========
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // verify-account from email link
    app.get('/verify-account',accountManager.verifyAccount, function(req, res) {
        res.redirect('/login');
    });

    // show the forget password form==========
    app.get('/forgotpassword', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('forgotpassword.ejs', { message: req.flash('passwordResetMessage') });
    });

    // process the forget password form=========
    app.post('/forgotpassword',accountManager.forgotPassword, function(req, res) {
        res.redirect('/login');
    });

    // show the reset password form==========
    app.get('/resetpassword', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('resetpassword.ejs', { message: req.param('token') });
    });

    // process the forget password form=========
    app.post('/resetpassword',accountManager.resetpassword, function(req, res) {
        res.redirect('/login');
    });

  

    /***********************************************************************************App Calls*********************/

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
      /*  var output = '';
        for (var property in req.user) {
            output += property + ': ' + req.user[property]+'; ';
        }*/
      //  console.log("req.user--1-"+req.user.local.email);
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // HOME SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/home', isLoggedIn, function(req, res) {
      /*  var output = '';
        for (var property in req.user) {
            output += property + ': ' + req.user[property]+'; ';
        }
        console.log("req.user---"+output);*/
        res.render('home.ejs', {
            user : req.user ,
            categories : Categories
        });
    });

    // process the update password request=========
    app.post('/updatepassword',accountManager.updatepassword, function(req, res) {
       // res.redirect('/login');
    });

    // process the update preferences request=========
    app.post('/updatePreferences',accountManager.updatePreferences, function(req, res) {
        // res.redirect('/login');
    });

    // process the update Contact Details request=========
    app.post('/updateContactDetails',accountManager.updateContactDetails, function(req, res) {
        // res.redirect('/login');
    });

    // process the update Contact Details request=========
    app.post('/updateBusinessDetails',accountManager.updateBusinessDetails, function(req, res) {
        // res.redirect('/login');
    });

    // process the get User data request=========
    app.get('/getUserData',accountManager.getUserData, function(req, res) {
        // res.redirect('/login');
    });


   // process the new lead save request=========
    app.post('/publishNewLead',leadHandler.publishNewLead, function(req, res) {
        // res.redirect('/login');
    });
   
    
    app.post('/updateProfilePic', accountManager.updateProfilePic,function(req, res) {
    	res.send(req.imageUrl);
    });

    // process the get User data request=========
    app.get('/getLeads',leadHandler.getLeads, function(req, res) {
        // res.redirect('/login');
    });
  //get the sub category of perticular category=========
    app.get('/getSubCategory',Categories.getSubCategory, function(req, res) {
        res.send(req.subCategory);
    });
    // process the save new comments on post request=========
    app.post('/saveComment',leadHandler.saveComment, function(req, res) {
        res.send(req.comments);
    });
     // process the save new reply on comments request=========
    app.post('/saveReply',leadHandler.saveReply, function(req, res) {
        res.send(req.replies);
    });


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/login');
}