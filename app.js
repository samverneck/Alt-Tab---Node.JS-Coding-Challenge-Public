'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const consign = require('consign');
const passportHttp  = require('passport-http')
const passport = require('passport')
const randomToken = require('random-token')
const validator = require('express-validator')
const passportLocal = require ('passport-local')
const BearerStrategy = require('passport-http-bearer').Strategy
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(validator());
app.use(cors());

// passport initialization
app.use(passport.initialize());

// using passport session
app.use(passport.session());

// use token authenticator bearer strategy
passport.use(new BearerStrategy(
	(token, done) => {
		let User = app.models.user;
		// find one user
		User.findOne({ token: token },  (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			}
			return done(null, user, { scope: 'all' });
		});
	}
));

// use passport local strategy username and password fields, verify login from user
passport.use(new passportLocal.Strategy({
	usernameField: 'email',
	passwordField: 'password',
}, verifyLogin));

// use passport http basic strategy verify login from user
passport.use(new passportHttp.BasicStrategy(verifyLogin));

// function to verify user login, username, password
function verifyLogin(username, password, done){
	const pass = require('./server/middleware/password');
	const User = app.models.user;
	let generateRandomToken = randomToken(32);
	// find one user
	User.findOne({email: username })
	.then(resultAll => {
		if(resultAll.email == username && pass.validate(resultAll.password, password)) {
			resultAll.token = generateRandomToken
			resultAll.save()
			.then(response => {
				done(null, resultAll);
			})
		} else {
			done(null, null);
		}
	})
}

// use passport serialize user
passport.serializeUser(function(user, done){
	done(null, user);
});

// use passport deserialize user
passport.deserializeUser(function(user, done){
	done(null, user);
});

// consign autoload logical
consign({cwd: 'server'})
.then('config')
.then('models')
.then('middleware')
.then('controllers')
.then('validate')
.then('routes')
.into(app)

// use app res status 404
app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3000

const server = http.createServer(app);

server.listen(port);
console.log(`Server running at http://127.0.0.1:${port}/`);

module.exports = app;
