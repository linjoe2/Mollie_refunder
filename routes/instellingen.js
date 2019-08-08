var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
//database
var Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:A1soddidvem!@localhost:5432/postgres');

var settings = sequelize.define('setting', {
	name: {
		type: Sequelize.STRING
	},
	parameter: {
		type: Sequelize.STRING
	}
});

settings.sync({
	force: true
});

router.get('/', ensureAuthenticated, function(req,res) {
	res.redirect('/instellingen/api')
})

router.get('/api', ensureAuthenticated, function(req, res) {
	settings.findOne({
		where: {
			name: 'molliekey'
		}
	}).then(key => {
		if (key) {
			res.render('instellingen/api', {
				molliekey: key.parameter
			})
		} else {
			res.render('instellingen/api', {
				molliekey: 'key nog niet bekend'
			})
		}
	});
})

router.post('/api', ensureAuthenticated, function(req, res) {
	var mollie = req.body.mollie
	console.log(mollie)
	settings.update({
		parameter: mollie
	}, {
		where: {
			name: 'molliekey'
		}
	});
	res.render('instellingen/api', {
				molliekey: mollie, msg: 'key geupdate'
			})
	});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}

module.exports = router;