// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path= require('path');
var app      = express();
var port     = process.env.PORT || 8888;

var passport = require('passport');
var flash    = require('connect-flash');

var controllers = require('./app/controllers');

const pool = require('./config/database');
// configuration ===============================================================
// connect to our database
app.use(express.static("public"));
require('./config/passport')(passport, pool, controllers); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.resolve('./app/views')); // set up ejs for templating
// required for passport
app.use(session({
	secret: 'kuga',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function(req,res,next){
	res.locals = ({
		user: req.user
	});
	return next();
});



// routes ======================================================================
require('./app/routes/routes.js')(app, passport, pool, controllers); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


