// config/passport.js
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');


// load up the user model


const pool = require('../config/database');
// expose this function to our app using module.exports
var customKey = null;
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });


    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, newUser);
        });
    });
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            //console.log(email);
            pool.query('SELECT * FROM "Users" WHERE user_email = ($1)',[email], function(err, rows) {
                if (err)
                {

                    return done(err);
                }
                if (rows.rows.length) {
                    return done(null, false, req.flash('signupMessage', 'Email đã được dùng.'));
                } else {
                    // if there is no user with that username
                    // create the user


                    var newUser = {
                        user_avatar : '/img/avatar_user_default.jpg',               
                        user_name: req.body.fullname,            
                        user_email : email,
                        user_phone : req.body.phone,
                        user_password: password  // use the generateHash function in our user model
                    };

                    // insert user in database
                    pool.query('INSERT INTO "Users" ("user_name", "user_phone", "user_email", "user_avatar", "user_password", "user_facebook_token", "user_facebook_id", "user_facebook_link") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
                        [newUser.user_name, newUser.user_phone, newUser.user_email, newUser.user_avatar, newUser.user_password, '-1',-1, '-1'], function (err, rows){
                        if (err){
                
                                return done(err);
                            }
                        return done(null, newUser);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    //log in với thông tin từ databasse của mình
    // mình lấy thông tin đó, sau đó mình kiểm tra.
    passport.use(
        'local-login',
        new LocalStrategy({
            //input type =text name="username" thì mặc định nó sẽ lấy username và passworrd
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

                

                pool.query('SELECT * FROM  "Users" WHERE  user_email = ($1)',[email], function(err, rows){
                if (err)
                    return done(err);
                // email not found
                 if (!rows.rows.length) {
                    return done(null, false, req.flash('loginMessage', 'Email do not exists.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (password != rows.rows[0].user_password)
                    return done(null, false, req.flash('loginMessage', 'Password is incorreect!.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows.rows[0]);
            });
        })
    );


    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ['id', 'emails', 'name','profileUrl','photos'] //get field recall
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {

            console.log(profile.id);
            // find the user in the database based on their facebook id

           pool.query('select * from "Users" where user_facebook_id=($1)',[profile.id],function(err, rows){
            if(err)
                return done(err);

            if(rows.rows.length)
                return done(null, rows.rows[0]);
            else {
                var newUser = new User();
                // // set all of the facebook information in our user model
                newUser.user_facebook.id    = profile.id; // set the users facebook id                   
                newUser.user_facebook.token = token; // we will save the token that facebook provides to the user                    
                newUser.user_name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.user_email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                newUser.user_avatar = profile.photos[0].value;
                newUser.user_facebook.link = profile.profileUrl;
                console.log('176');
                pool.query('INSERT INTO "Users" (user_facebook_id, user_facebook_token, user_facebook_link, user_avatar, user_name, user_email, user_password) values ($1,$2,$3,$4,$5,$6,$7)',[newUser.user_facebook.id, newUser.user_facebook.token, newUser.user_facebook.link, newUser.user_avatar,newUser.user_name, newUser.user_email, '-1'],function(err, rows){
                    if(err)
                        return done(err);
                    return done(null, newUser);
                });
            }
           });
        });
    }));
};