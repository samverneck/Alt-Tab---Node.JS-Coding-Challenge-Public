module.exports = app => ({

	// register validate user
	register: (req, res, next) => {
		req.assert('name', 'valid name is required').notEmpty();
		req.assert('email', 'valid email is required').isEmail();
		req.assert('password', '6 to 2000 characters required').len(6, 2000);
		const error = req.validationErrors()
		error
			? res.status(400).json(error)
			: next();
	},
	// login validate user
	login: (req,res,next) => {
		req.assert('email', 'valid email is required').isEmail();
		req.assert('password', '6 to 2000 characters required').len(6, 2000);
		const error = req.validationErrors()
		error
			? res.status(400).json(req.validationErrors())
			: next();
	}
})
