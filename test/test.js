//testing login id admin pass admin
var request = require('supertest');
var should = require('should');
var app = require('../server');
var swig = require('swig');
var connection = require('../configs/db');

// describe('GET /login', function(){
// 	it('Link to the login page', function(done){
// 		request(app)
// 		.get('/login')
// 		.expect(200)
// 		.end(function(err, res){
// 			var html = swig.renderFile('./views/login.html');
//       		res.text.should.equal(html);
//       		done();
// 		});
// 	});
// });
describe('User', function(){
	it('should be able to display the user login page', function(done){
      request(app)
        .get('/login')
        .expect(200, done);
    });
    it('should be able to display the user register page', function(done){
      request(app)
        .get('/signup')
        .expect(200, done);
    });
	it('should return to /signup when trying to save duplicate name', function(done){
		var user = {
			username: 'admin',
			password: 'admin'
		};
		request(app)
		.post('/signup')
		.send(user)
		.end(function(err, res){
			res.header['location'].should.equal('/signup');
			done();
		});
	});
});
