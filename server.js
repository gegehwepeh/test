/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var compress = require('compression');
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('flash');
var redis = require('redis');
var connectRedis = require('connect-redis');
var redisStore = connectRedis(session);
var redisClient = redis.createClient();
var sessionStore = new redisStore({client: redisClient});
var debug = require('debug')('redispubsub');
var http = require('http');
/**
 * Create Express server.
 */
var app = express();
require('./configs/passport')(passport);
/**
 * Express configuration.
 */
//app.set('port', process.env.PORT || 3000);
var port = process.env.PORT || 3000
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
	extended: true
}));

var sessionMiddleware = session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } );

app.use(bodyParser.json());
// required for passport
app.use(cookieParser());
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
require('./routes/testchat')(app);
app.get('/user', function(req, res){
  res.send(200, { name: 'marcus' });
});
/**
 * Start Express server.
 */
 app.sessionStore = sessionStore;
app.cookieParser = cookieParser;
app.session = session;

var server = http.createServer(app);

var socketIO = require('socket.io');
var io = socketIO(server);


server.listen(port);
console.log('Express server listening on port %d in %s mode', port, app.get('env'));

// io.configure( function() {
// 	io.set('close timeout', 60*60*24); // 24h time out
// });

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('join', function(roomName){
    socket.join(roomName);
    console.log(roomName);
  });
});
// app.listen(app.get('port'), function() {
//   console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
// });

module.exports = app;