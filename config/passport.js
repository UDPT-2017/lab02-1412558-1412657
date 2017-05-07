// config/passport.js


// nodemailer
var nodemailer=require('nodemailer');
var transporter = nodemailer.createTransport('smtp://kool.milk.tea%40gmail.com:Thienduongvangem@smtp.gmail.com');








// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');


// load up the user model

var bcrypt = require('bcrypt-nodejs');
const pg = require('pg')
var config = {
  user: 'knxcbxyijkokeu', //env var: PGUSER
  database: 'dakh6j1dv2f8jj', //env var: PGDATABASE
  password: '642dfea2e4ac783e944acbd3805d41bba25872b9701241c8e4af09a8230f46b5', //env var: PGPASSWORD
  host: 'ec2-54-225-182-108.compute-1.amazonaws.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 50, // max number of clients in the pool
  idleTimeoutMillis: 300000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
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
            pool.query('SELECT * FROM "Users" WHERE email = ($1)',[email], function(err, rows) {
                if (err)
                    return done(err);
                //console.log(rows.rows[0].email);
                //console.log(rows.rows.length);
                if (rows.rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user


                    var newUser = {
                        avatar : '/img/avatar_user_default.jpg',               
                        name: req.body.fullname,            
                        email : email,
                        phone : req.body.phone,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    // insert user in database
                    pool.query('INSERT INTO "Users" ("name", "phone", "email", "avatar", "password", "facebook_token", "facebook_id", "facebook_link") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
                        [newUser.name, newUser.phone, newUser.email, newUser.avatar, newUser.password, '',-1, ''], function (err, rows){
                        if (err){
                
                                return done(err);
                            }


                                var mailOptions = {
                                    from: '"Yuma Kuga"',
                                    to: newUser.email,
                                    subject: 'Welcome to kool milk tea',
                                    text: 'Hi, We inform you for this email was used to register account  at kool.milk.tea. Wish you a good day'
                                };

                                transporter.sendMail(mailOptions, function(error, info)
                                {
                                    if(error)
                                    {
                                        console.log(error);
                                    }
                                    else
                                    {
                                        console.log('Message sent: ' + info.response);
                                    };
                                });



                            ////////// send mail //////////
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
                pool.query('SELECT * FROM  "Users" WHERE  email = ($1)',[email], function(err, rows){
                if (err)
                    return done(err);
                // email not found
                 if (!rows.rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No email found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows.rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user

                var mailOptions = {
                    from: '"Yuma Kuga"',
                    to: rows.rows.email,
                    subject: 'Welcome to kool milk tea',
                    text: 'Hi, We inform you for this email was logged at kool.milk.tea. Wish you a good day'
                };

                transporter.sendMail(mailOptions, function(error, info)
                {
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        console.log('Message sent: ' + info.response);
                    };
                });

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



    //console.log("route 197");
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
       // console.log("route 202");
        process.nextTick(function() {

            // find the user in the database based on their facebook id
           // console.log("route 206");

            pool.query('SELECT * FROM "Users" WHERE "facebook_id" = ($1)',[profile.id], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.rows.length) {

                    var mailOptions = {
                        from: '"Yuma Kuga"',
                        to: rows.rows[0].email,
                        subject: 'Welcome to kool milk tea',
                        text: 'Hi, We inform you for this email was logged at kool.milk.tea. Wish you a good day'
                    };

                    transporter.sendMail(mailOptions, function(error, info)
                    {
                        if(error)
                        {
                            console.log(error);
                        }
                        else
                        {
                            console.log('Message sent: ' + info.response);
                        };
                    });

                    return done(null,  rows.rows[0]);
                } else {
                    // if there is no user with that username
                    // create the user
                     var newUser = new User();
                    // // set all of the facebook information in our user model
                    newUser.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.avatar = profile.photos[0].value;
                    newUser.facebook.linkFB = profile.profileUrl;
                    // //nó sẽ bị lỗi chỗ name nay, email nay vì ssao, nó ghi xún trắng
                    // console.log(newUser);
                    //console.log(profile);
                    // insert user in database
                   // console.log(newUser.name);
                    pool.query('INSERT INTO "Users" ("facebook_id", "password",facebook_token", "name", "email", "avatar", "facebook_link") VALUES ($1,$2,$3,$4,$5,$6)',
                        [profile.id, '!@#$%)*(%^^&$%##$%#$%%^&^!##$^%%*(%$',newUser.facebook.token, newUser.name, newUser.email, newUser.avatar, newUser.facebook.linkFB], function (err, rows){
                        if (err){
                               // console.log("lỗi zồi");
                                return done(err);
                            }


                        var mailOptions = {
                            from: '"Yuma Kuga"',
                            to: rows.rows.email,
                            subject: 'Welcome to kool milk tea',
                            text: 'Hi, We inform you for this email was logged at kool.milk.tea. Wish you a good day'
                        };

                        transporter.sendMail(mailOptions, function(error, info)
                        {
                            if(error)
                            {
                                console.log(error);
                            }
                            else
                            {
                                console.log('Message sent: ' + info.response);
                            };
                        });
                        return done(null, newUser);
                    });
                }
            });
        });
       // console.log("route 244");

    }));
};