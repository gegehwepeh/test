var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbConfig = require('./db');
var connection = mysql.createConnection(dbConfig.connection);
connection.connect();
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
	
}