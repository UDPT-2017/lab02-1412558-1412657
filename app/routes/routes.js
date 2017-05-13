// app/routes.js



//var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app, passport, pool, controllers) {
	

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


	app.get('/', controllers.home.index);

	app.get('/about', controllers.about.index);

	

	app.get('/users', isLoggedIn, controllers.users.index);

	app.get('/messages', isLoggedIn, controllers.messages.index);

	app.get('/messages/read-messages/id-messages=:id', isLoggedIn, controllers.messages.read);

	app.get('/messages/inbox-messages', isLoggedIn, controllers.messages.inbox);

	app.get('/messages/new-messages', isLoggedIn, controllers.messages.new);
	app.post('/messages/new-messages', isLoggedIn, controllers.messages.postNew);
	
	app.get('/messages/sent-messages', isLoggedIn, controllers.messages.sent);

	app.get('/messages/friends', isLoggedIn, controllers.messages.friend);
}; // end export


function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	// "/" => trang chủ
	res.redirect('/login');
}
//
function isLogged(req, res, next) {

	// if user is authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}