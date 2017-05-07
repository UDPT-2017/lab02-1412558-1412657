// app/routes.js

var nodemailer=require('nodemailer');
var transporter = nodemailer.createTransport('smtp://kool.milk.tea%40gmail.com:Thienduongvangem@smtp.gmail.com');


//var urlencodedParser = bodyParser.urlencoded({ extended: false });






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
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	var bcrypt = require('bcrypt-nodejs');
	app.get('/', function(req, res) {
		
		//console.log(bcrypt.hashSync(123456, null, null)); 
		res.render('index.ejs', {
			user : req.user // get the user out of session and pass to template
		}); // load the index.ejs file
	});

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
		successRedirect : '/', // redirect to the secure profile section
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


	app.get('/', function (req,res){
		//console.log(__dirname);
		res.render("index.ejs");
	});


	app.get('/blog', function (req,res){
		pool.connect(function(err, client, done) {
		  	if(err) {
		    	return console.error('error fetching client from pool', err);
		  	}
		  
		  	// select blog
		  	client.query('SELECT * FROM "Blog"', function(err, result) {
			done(err);
		    if(err) {
		    	res.end();
		      	return console.error('error running query', err);
		    }
		    res.render("blog.ejs", {blog_list:result, user:req.user});
		  	}); // end client
		}); // end pool
		//res.send("lỗi load blog");
	}); // end app


	app.get('/blog/detail/id=:id', function (req,res){	
		var id=req.params.id;
		console.log(req.params.emailAuthor);
		pool.connect(function(err, client, done) {
		  	if(err) {
		    return console.error('error fetching client from pool', err);
		  	}

		  	// select blog 
		  	client.query('UPDATE "Blog" SET view=view+1 where id='+id, function(err, ro ){
			    if(err) {
			    	res.end();
			      	return console.error('error running query', err);
		   		}
		   			// update view
		   			client.query('SELECT * FROM "Blog" where id = '+ id, function(err, result) 
		   			 {
		   				if(err) {
				    		res.end();
				      		return console.error('error running query', err);
				   		}

					 		// select comment of blog
					   		client.query('SELECT * FROM "Comment" where blog ='+id, function(err, rb) {
							    if(err) {
							    	res.end();
							      	return console.error('error running query', err);
							    }

							    res.render("blogdetail.ejs", {
							    	blog : result.rows[0], 
							    	comment_list : rb,
							    	user: req.user
							    });
							    }); //end client  
				   		}); //end client
				}); //end client
		    }); //end pool
	}); //end app

	app.post("/blog/detail/id=:id", function (req,res){
		if (!req.isAuthenticated())
		{
			res.redirect('/login');
		}
		else
		{
			var emailAuthor = req.body.emailAuthor;
			var comment_content = req.body.textarea;
			var idBlog = req.params.id;

			console.log(idBlog);
			var user=req.user;
			var date= new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
			// replace T with a space
			//res.send(email);
			// nọi dung đưa db reload trang
			console.log(emailAuthor);
			console.log(comment_content);
			//insert comment in database
			pool.connect(function(err, client, done) {
			  	if(err) {
			    	return console.error('error fetching client from pool', err);
			  	}
			  	// select blog
			  	client.query('INSERT INTO "Comment" ("content", "time", "idCommentator", blog, "nameCommentator", "avatarCommentator") VALUES ($1,$2,$3,$4,$5,$6)',[comment_content,date, user.id, idBlog, user.name, user.avatar], function(err, result) {
				done(err);
			    if(err) {
			    	res.end();
			      	return console.error('error running query', err);
			    }

			    res.render("blog.ejs", {blog_list:result, user:req.user});
			  	
			  	}); // end client
			}); // end pool

			// send mail to Author who write Blog
			var mailOptions = {
		        from: '"Yuma Kuga"',
		        to: emailAuthor,
		        subject: 'Inform from KOOL MILK TEA',
		        text: 'Hi, We inform you for someone commented in your blog at kool milk tea. Wish you a good day'
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
			// reload page
			var link='/blog/detail/id='+idBlog;
			res.redirect(link);
		}
	});


	app.get("/about", function (req,res){
		res.render("about.ejs", {user:req.user});
	});

	app.get("/albums", function (req,res){

		// load albums
		pool.connect(function(err, client, done) {
			  	if(err) {
			    	return console.error('error fetching client from pool', err);
			  	}
			  	// select blog
			  	client.query('SELECT * FROM "Albums"', function(err, result) {
				done(err);
			    if(err) {
			    	res.end();
			      	return console.error('error running query', err);
			    }

			    res.render("albums.ejs", {albums_list:result, user:req.user});
			  	
			  	}); // end client
			}); // end pool
	});


	app.get("/albums/add", function (req,res){
		
		// user not yet login
		if (!req.isAuthenticated())
		{
			res.redirect('/login');
		}
		else
		{	
			// reload page
			//var link='/albums/detail/id-'+idAlbums;
			res.render("albums-add.ejs", {user:req.user});
		}
		

	});


	app.get("/albums/detail/id=:id", function (req,res){

		var id_albums= req.params.id;
		console.log(id_albums);
		// load albums
		pool.connect(function(err, client, done) {
			  	if(err) {
			    	return console.error('error fetching client from pool', err);
			  	}
			  	// select blog
			  	client.query('SELECT * FROM "Photos" where id_albums =' +id_albums, function(err, result) {
				done(err);
			    if(err) {
			    	res.end();
			      	return console.error('error running query', err);
			    }
			    else{

			    	console.log(result);
			    	res.render("albums-detail.ejs", {photos_list: result, user:req.user});
			    }


			  	
			  	}); // end client
			}); // end pool
	});

	app.get("/albums/:id1/photo/id=:id2", function (req,res){

		
		console.log(req.params.id1);
		console.log(req.params.id2);
		var id_albums=req.params.id1;
		var id_photos=req.params.id2;
	
	
		// load albums
		
		pool.connect(function(err, client, done) {
			if(err) {
			    return console.error('error fetching client from pool', err);
			}
			  	// update view for column albums and photo
			  	client.query('UPDATE "Photos" SET view=view+1 where id =' +id_photos, function(err, rs1) {
				done(err);
			    if(err) {
			    	res.end();
			      	return console.error('error running query', err);
			    }
			    else{

			    	client.query('UPDATE "Albums" SET total_view=total_view+1 where id =' +id_albums, function(err, rs2) {
					done(err);
				    if(err) {
				    	res.end();
				      	return console.error('error running query', err);
				    }
				    else {
					    client.query('SELECT * FROM "Photos" where id =' +id_photos, function(err, rs3) {
						done(err);
						if(err) {
						    res.end();
						    return console.error('error running query', err);
						}
						else {

						    //console.log(result);
						    res.render("albums-photos.ejs", {photos: rs3.rows[0], user:req.user});
						    }
				    	}); // end client
					}
					}); // end client
			    
			    	};
			  	
			  	}); // end client

			}); // end pool
	}); // end app






	
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