var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var Sequelize = require('sequelize')
var bcrypt = require('bcryptjs');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

//database
var sequelize = new Sequelize('');
var user = sequelize.define('user', {
	username: {
		type: Sequelize.STRING
	},
	password: {
		type: Sequelize.STRING
	},
	role: {
		type: Sequelize.STRING
	}
});

var settings = sequelize.define('setting', {
	name: {
		type: Sequelize.STRING
	},
	parameter: {
		type: Sequelize.STRING
	}
});


//passport.js
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log(username)
		user.findOne({
			where: {
				username: username
			}
		}).then(user => {
			if (!user.username) {
				return done(null, false, {
					message: 'Incorrect username.'
				});
			}
			if (bcrypt.compareSync(password, user.password)) {
				console.log('ww klopt')
				return done(null, user);
			}
		});
	}
));

passport.serializeUser(function(user, done) {
	console.log('serialize:' + user.id)
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log('deserialize:' + id)
		// user.findById(id, function(err, user) {
		// 	done(err, user);
		// 	console.log(user)
		// });
	user.findOne({
		where: {
			id: id
		}
	}).then(user => {
		done('', user);
	})
});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash: true
	}),
	function(req, res) {
		// res.redirect('/');
	});

//routes

router.get('/', ensureAuthenticated, function(req, res) {
	res.render('users/user', {
		page: 'users',
		item: user
	})
})

router.get('/register', ensureAuthenticated, function(req, res) {
	res.render('users/register', {
		page: 'users',
		item: 'register'
	})
})

router.post('/register', ensureAuthenticated, function(req, res) {
	var username = req.body.username
	var password = req.body.password
	var password_check = req.body.password_check
	var role = req.body.role

	//validator
	req.checkBody('username', 'gebruikersnaam is verplicht').notEmpty();
	req.checkBody('password', 'wachtwoord is verplicht').notEmpty();
	req.checkBody('role', 'rol is verplicht').notEmpty();
	req.checkBody('password_check', 'wachtwoorden zijn verschillend').equals(password)



	var errors = req.validationErrors();

	if (errors) {
		res.render('users/register', {
			page: 'users',
			item: 'register',
			errors: errors
		})
	} else {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				console.log('user created')
				user.create({
					username: username,
					password: hash,
					role: role
				})
				console.log('user: ' + username + ' is created')
				res.render('users/register', {
					page: 'users',
					item: 'register',
					done: username
				})
			})
		})
	}
})

router.get('/logout', ensureAuthenticated, function(req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/')
});

router.get('/reset', ensureAuthenticated, function(req, res) {
	res.render('users/reset', {
		page: 'users',
		item: 'reset'
	})
})

router.post('/reset', function(req, res) {
	var username = req.body.username
	var password = req.body.password
	var password_check = req.body.password_check

	//validator
	req.checkBody('username', 'gebruikersnaam is verplicht').notEmpty();
	req.checkBody('password', 'wachtwoord is verplicht').notEmpty();
	req.checkBody('password_check', 'wachtwoorden zijn verschillend').equals(password)
	var errors = req.validationErrors();

	if (errors) {
		res.render('users/reset', {
			page: 'users',
			item: 'reset',
			errors: errors
		})
	} else {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				user.update({
					username: username,
					password: hash
				})
			})
		})
		console.log('user: ' + username + ' is updated')
		res.render('users/reset', {
			page: 'users',
			item: 'reset',
			done: username
		})
	}
})

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}


module.exports = router;
