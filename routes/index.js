var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

router.get('/', function (req, res) {
	res.render('index', { page: 'index', item: 'homepage' })
})

router.get('/dashboard', ensureAuthenticated, function (req, res) {
	// if(req.user.role == 'service') {
	// 	res.render('dashboard/service')
	// }else if(req.user.role == 'admin')
	// res.render('dashboard/admin')
	res.redirect('/mollie')
})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}

module.exports = router;