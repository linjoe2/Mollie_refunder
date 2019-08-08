var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

//routes
var routes = require('./routes/index')
var users = require('./routes/users')
var mollie_routes = require('./routes/mollie')
var instellingen = require('./routes/instellingen')


app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(expressValidator());

//express sessions
app.use(session({
	secret: 'sevret',
	saveUninitialized: true,
	resave: true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

//express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//express flash
app.use(flash());

app.use(function (req,res, next) {
	res.locals.succes_msg = req.flash('succes_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
	next();
});


//routes
app.use('/', routes)
app.use('/users', users)
app.use('/mollie', mollie_routes)
app.use('/instellingen', instellingen)


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
