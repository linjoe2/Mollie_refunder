var express = require('express')
var router = express.Router();
// mollie
var mollie = require('mollie')({
	apikey: ''
});

router.get('/', ensureAuthenticated,function(req, res) {
	res.render('mollie/refund')
})

router.post('/refundCheck', ensureAuthenticated, function(req, res) {
	paymentId = req.body.paymentId;
	paymentAmount = req.body.paymentAmount;
	if(paymentAmount.includes(',')){
		paymentAmount = paymentAmount.replace(',','.');
	}
	mollie.payments.get(paymentId, function(err, data) {
		if (err) {
			console.log(err)
			res.render('mollie/refund', {
				errors: err
			})
		} else {
			if (paymentAmount == '') {
				paymentAmount = data.amount
			}
			res.render('mollie/accept', {
				details: data.details,
				paymentAmount: paymentAmount,
				paymentId: paymentId,
			})
		}

	})
});

router.post('/refund_send', ensureAuthenticated, function(req, res) {
	paymentId = req.body.paymentId;
	paymentAmount = req.body.paymentAmount;
	if(paymentAmount.includes(',')){
		paymentAmount = paymentAmount.replace(',','.');
	}
	console.log('refund actie gestart');
	console.log('id: ' + paymentId);
	console.log('bedrag: ' + paymentAmount);
	mollie.refunds.create(paymentId, paymentAmount, function(err, data) {
		if (err) {
			console.log(err);
			res.render('mollie/accept', {
				paymentAmount: paymentAmount,
				paymentId: paymentId,
				errors: err
			})
		} else {
			res.render('mollie/accept', {
				details: data.details,
				paymentAmount: paymentAmount,
				paymentId: paymentId,
				done: true
			})
		}
	});

});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}

module.exports = router;
