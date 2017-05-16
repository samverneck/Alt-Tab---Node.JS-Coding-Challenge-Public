module.exports = app => {
	const mongoose = require('mongoose')
	const Schema = mongoose.Schema;
	const pass = require('../middleware/password');

	// function to config user password and hash its password
	const configPass = (v) => pass.hash(v);

	// mongoose user schema mongo
	const User = new Schema({
		name: {type: String, required: true},
		email: {type: String, required: true, unique:true},
		password: {type: String, required: true, set: configPass},
		token: {type: String, required: true}
	});

	// user index email
	User.index({email: 1});

	// mongoose user model mongo
	return mongoose.model('User', User);

}
