/**
 * GET /
 * Home page.
 */
var connection = require('../configs/db');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('home');
	});
	app.get('/test', function(req, res){
		connection.query('SELECT * FROM tbl_user WHERE id = ?', [1], function(err, results) {
  			res.send(results[0].id);
		});
	});
	app.get('/login', function(req, res) {
		res.render('login');
	});
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		})
	// ,
 //        function(req, res) {
 //            console.log("hello");
 //            if (req.body.remember) {
 //              req.session.cookie.maxAge = 1000 * 60 * 3;
 //            } else {
 //              req.session.cookie.expires = false;
 //            }
 //        res.redirect('/');
 //    }
    );
    app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup');
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));




	app.get('/index-facebook', function(req, res){
	  res.render('index-facebook.ejs', { user: req.user });
	});

	app.get('/account-facebook', ensureAuthenticated, function(req, res){
	  res.render('account-facebook.ejs', { user: req.user });
	});

	app.get('/login-facebook', function(req, res){
	  res.render('login-facebook.ejs', { user: req.user });
	});

	// GET /auth/facebook
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Facebook authentication will involve
	//   redirecting the user to facebook.com.  After authorization, Facebook will
	//   redirect the user back to this application at /auth/facebook/callback
	app.get('/auth/facebook',
	  passport.authenticate('facebook'),
	  function(req, res){
	    // The request will be redirected to Facebook for authentication, so this
	    // function will not be called.
	  });

	// GET /auth/facebook/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { failureRedirect: '/login-facebook' }),
	  function(req, res) {
	    res.redirect('/index-facebook');
	  });

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/index-facebook');
	});

	// Simple route middleware to ensure user is authenticated.
	//   Use this route middleware on any resource that needs to be protected.  If
	//   the request is authenticated (typically via a persistent login session),
	//   the request will proceed.  Otherwise, the user will be redirected to the
	//   login page.
	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/login-facebook')
	}


};
