module.exports = app => ({
	// create user
	create: (req,res) => {
		const randomToken = require('random-token')
		let generator = randomToken(32);
		const User = app.models.user;
		// token is generated
		req.body.token  = generator;
		// create user
		User.create(req.body)
		// success created user
		.then(user => {
			res.status(201).json(user);
		})
		// error to create user
		.catch(err => {
			res.status(400).json(err);
		})
	},
	// list profile one user
	listProfileOne: (req,res) => {
		// succes user profile listed
		res.status(200).json(req.user);
	},
	// user logged
	logged: (req,res) => {
		// success logged user
		res.status(200).json(req.user);
	},
	// user fail, error login user
	fail: (req,res) => res.status(400),
	// user logout
	logout: (req,res) => {
		const User = app.models.user;
		const query = {_id: req.user._id}
		const mod = {
			// token set to empty when user logout
			$set: {
				token: ''
			}
		}
		// user updates when login out
		User.update(query, mod)
		// success user logged out
		.then(() => {
			res.status(200).json({logout: true})
		})
	}
})
