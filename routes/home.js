/**
 * GET /
 * Home page.
 */
var mysql = require('mysql')
var db = require('../configs/db');
var connection = mysql.createConnection(db.connection);
connection.connect();
module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('home');
	});
	app.get('/test', function(req, res){
		connection.query('SELECT * FROM tbl_user WHERE id = ?', [61], function(err, results) {
  			res.sendStatus(results[0].id);
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

};
