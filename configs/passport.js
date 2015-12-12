var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var connection = require('./db');

module.exports = function(passport){
	// Passport session setup
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM tbl_user WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });
    passport.use('local-signup', new LocalStrategy({
    	// by default, local strategy uses username and password, we will override with email
    	usernameField: 'username',
    	passwordField: 'password',
    	passReqToCallback : true // allows us to pass back the entire request to the callback
    	}, 
    	function(req, username, password, done){
    		connection.query("SELECT * FROM tbl_user WHERE nama = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    //return done(null, false, res.status(400));
                } else {
                	var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };
                    var insertQuery = "INSERT INTO tbl_user ( nama, password ) values (?,?)";
                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
    	}
    ));
	passport.use('local-signin', new LocalStrategy({
    	// by default, local strategy uses username and password, we will override with email
    	usernameField: 'username',
    	passwordField: 'password',
    	passReqToCallback : true // allows us to pass back the entire request to the callback
    	}, 
    	function(req, username, password, done){
    		connection.query("SELECT * FROM tbl_user WHERE nama = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                	// create the loginMessage and save it to session as flashdata
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
                // all is well, return successful user
                return done(null, rows[0]);
            });
    	}
    ));

    // Use the FacebookStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Facebook
    //   profile), and invoke a callback with a user object.
    passport.use('facebook', new FacebookStrategy({
        clientID: '',
        clientSecret: '',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
          
          // To keep the example simple, the user's Facebook profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the Facebook account with a user record in your database,
          // and return that user instead.
          return done(null, profile);
        });
      }
    ));
	
}