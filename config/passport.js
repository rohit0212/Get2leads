// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User = require('../model/user');

//for sending email
var emailDispatcher= require('../controller/email-dispatcher');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'The email you entered already exist.'));
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser            = new User();
                        console.log("req.param('firstName')-"+req.param('firstName'));
                        // set the user's local credentials

                        newUser.local.userType    = req.param("userType");
                        newUser.local.email       = email;
                        newUser.local.password    = newUser.generateHash(password);
                        newUser.local.userDetails.contactDetails.firstName  = req.param("firstName");
                        newUser.local.userDetails.contactDetails.lastName    = req.param("lastName");
                        newUser.local.isVerified  = false;


                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            emailDispatcher.dispatchVarifyPasswordLink(newUser, function(e, m){
                                // this callback takes a moment to return //
                                // TODO add an ajax loader to give user feedback //
                                if (!e){
                                    console.log('mail send');
                                    return done(null, newUser);
                                }	else{
                                    for (k in e) console.log('ERROR : ', k, e[k]);
                                    console.log('unable to dispatch password reset');
                                    return done(null, false, req.flash('signupMessage', 'There is some error please try again.'));
                                }
                            });


                        });
                    }

                });

            });

        }));

// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email },
                'local.email local.password local.userDetails.contactDetails.firstName local.userDetails.contactDetails.lastName local.userType local.isVerified local.profileImageUrl',
                function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash("loginMessage", "The email you entered don't match.")); // req.flash is the way to set flashdata using connect-flash

                if(!user.local.isVerified)
                    return done(null, false, req.flash("loginMessage", "Please verify your email. Link sent to your mail."));
                           // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash("loginMessage", "The password you entered don't match.")); // create the loginMessage and save it to session as flashdata
//console.log("user-----------------"+user);



        /*        // Load the twilio module
                var twilio = require('twilio');

// Create a new REST API client to make authenticated requests against the
// twilio back end
                var client = new twilio.RestClient('AC2a1f92495464fa88ce72bc3a7d25c226', '79c4e18dfd761dac0f5d6853fd1ee00a');

// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
                client.sms.messages.create({
                    to:'+14084441970',
                    from:'8317095195',
                    body:'Hi, you loged in succesfully.'
                }, function(error, message) {
                    // The HTTP request to Twilio will run asynchronously. This callback
                    // function will be called when a response is received from Twilio
                    // The "error" variable will contain error information, if any.
                    // If the request was successful, this value will be "falsy"
                    if (!error) {
                        // The second argument to the callback will contain the information
                        // sent back by Twilio for the request. In this case, it is the
                        // information about the text messsage you just sent:
                        console.log('Success! The SID for this SMS message is:');
                        console.log(message.sid);

                        console.log('Message sent on:');
                        console.log(message.dateCreated);
                    } else {
                        console.log('Oops! There was an error.');
                    }
                });
*/







                // all is well, return successful user
                return done(null, user);
            });

        }));




};