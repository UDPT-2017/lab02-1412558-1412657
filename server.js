// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8888;

var passport = require('passport');
var flash    = require('connect-flash');

const pg = require('pg')
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'lab02', //env var: PGDATABASE
  password: 'Kuga1996', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 50, // max number of clients in the pool
  idleTimeoutMillis: 300000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
// configuration ===============================================================
// connect to our database
app.use(express.static("public"));
require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'kuga',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);




var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/img');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var upload = multer({ storage : storage}).array('uploadPhotos',100);



app.post("/albums/add",urlencodedParser, function (req,res) {
  //,urlencodedParser
    console.log("gọi upload");
    console.log(req.body);

    //var uploadPhotos = multer({ storage : storage}).array('photos',20);
    upload(req, res, function (err) {
      if (err) {
        res.send("upload xảy ra lỗi");
      }

      res.redirect('/albums');
    })
  });










/*
                    upload(req, res, function (err) {
                        if (err) {
                          // An error occurred when uploading
                          return
                        }

                        // Everything went fine
                        })
*/