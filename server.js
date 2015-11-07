/**
 * Module dependencies.
 */
var express = require('express');
var compress = require('compression');
var path = require('path');
var swig = require('swig');

/**
 * Create Express server.
 */
var app = express();
/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(compress());

/**
 *  Routes (route handlers/its like a controller).
 */
var homeRoute = require('./routes/home');
app.get('/', homeRoute.index);
/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});