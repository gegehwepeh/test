/**
 * Module dependencies.
 */
var express = require('express');
var session = require('express-session');
var compress = require('compression');
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('flash');

/**
 * Create Express server.
 */
var app = express();
require('./configs/passport')(passport);
/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.set('views', __dirname + '/views');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(compress());

/**
 *  Routes (route handlers/its like a controller).
 */
require('./routes/home')(app, passport);
app.get('/user', function(req, res){
  res.send(200, { name: 'marcus' });
});
/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;