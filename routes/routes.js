// app/routes.js



//var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app, passport, pool) {
	

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', isLogged, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { 
	  	successRedirect: '/profile',
	    failureRedirect: '/login' 
	}));


	app.get('/', function(req, res) {
		res.render('index.ejs', {
			user : req.user // get the user out of session and pass to template
		}); // load the index.ejs file
	});

	app.get('/about',function(req, res){
		res.render('about.ejs', {
			user:req.user});
	});

	

	app.get('/users',function(req, res){
		res.render('users.ejs', {
			user:req.user});
	});

	app.get('/messages',function(req, res){
		res.render('messages.ejs', {
			user:req.user});
	});

	app.get('/messages/inbox-messages',function(req, res){
		res.render('inbox-messages.ejs', {
			user:req.user});
	});

	app.get('/messages/new-messages',function(req, res){
		res.render('new-messages.ejs', {
			user:req.user});
	});
	
	app.get('/messages/sent-messages',function(req, res){
		res.render('sent-messages.ejs', {
			user:req.user});
	});

	app.get('/messages/friends',function(req, res){
		res.render('friends.ejs', {
			user:req.user});
	});
}; // end export


function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	// "/" => trang chủ
	res.redirect('/');
}
//
function isLogged(req, res, next) {

	// if user is authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

////////////////////////////////SEND MAIL /////////////////////////////


 //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  					// FACEBOOK LOGIN //
   //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    /*
 module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
   

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};
*/