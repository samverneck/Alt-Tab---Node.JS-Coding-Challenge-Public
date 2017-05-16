module.exports = app => {
	const passport = require('passport')
	// const path = require('path')

	const Validate = app.validate.user
	const User = app.controllers.user
	const url = '/api'

	// app get route user login fail, user fail thruout login
	app.get(`${url}/loginfail`, User.fail);

	// app post route user register, validating user register, user create thruout register
	app.post(`${url}/register`, Validate.register,  User.create);

	// app get route user profile, authenticate user profile, user list one profile thruout authenticate profile
	// 											  bearer token, not require session support, then set to false
	app.get(`${url}/profile`, passport.authenticate('bearer', { session: false }),  User.listProfileOne);

	// app post route user login, validating user login, authenticate user login, user logged thruout login
	//																			local authentication, login fail to redirect to route login fail
	app.post(`${url}/login`, Validate.login, passport.authenticate('local', { failureRedirect: `${url}/loginfail`}), User.logged);

	// app get route user logout, authenticate user profile, user logout thruout its logout
	//											 bearer token, not require session support, then set to false
	app.get(`${url}/logout`, passport.authenticate('bearer', { session: false }), User.logout);

}
