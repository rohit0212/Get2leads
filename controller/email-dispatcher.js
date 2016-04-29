
var appConfig = require('../config/appconfig');

var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({
	host 	    : process.env.EMAIL_HOST || 'smtp.globat.com',
	user 	    : process.env.EMAIL_USER || 'get2leads@rollingpoint.com',
	password    : process.env.EMAIL_PASS || 'Adm1n123',
	ssl		    : true
});

EM.dispatchVarifyPasswordLink = function(user, callback){
	EM.server.send({
		from         : process.env.EMAIL_FROM || 'Get2Leads<do-not-reply@rollingpoint.com>',
		to           : user.local.email,
		subject      : 'Varify Account',
		text         : 'something went wrong... :(',
		attachment   : EM.composeVarifyPasswordEmail(user)
	}, callback );
}

EM.composeVarifyPasswordEmail = function(user){
	var link = __dirname +'/verify-account?e='+user.local.email+'&p='+user.local.password;
	var html = "<html><body>";
	html += "Hi "+user.local.userDetails.contactDetails.firstName+",<br><br>";
	html += "Your username is <b>"+user.local.email+"</b><br><br>";
	html += "<a href='"+link+"'>Click here to verify your password</a><br><br>";
	html += "Thank you for using Get2Leads!,<br><br>";
	html += "Cheers,<br>";
	html += "<a href='http://Get2Leads.com'>Get2Leads</a><br><br>";
	html += "</body></html>";
	return  [{data:html, alternative:true}];
}

EM.dispatchForgotPasswordLink = function(user, callback){
	EM.server.send({
		from         : process.env.EMAIL_FROM || 'Get2Leads Login <do-not-reply@rollingpoint.com>',
		to           : user.local.email,
		subject      : 'Forgot Password?',
		text         : 'something went wrong... :(',
		attachment   : EM.composeForgotPasswordEmail(user)
	}, callback );
}

EM.composeForgotPasswordEmail = function(user){
	var link = appConfig.appUrl +'/resetpassword?token='+user.local.password;
	var html = "<html><body>";
	html += "Hi "+user.local.userDetails.contactDetails.firstName+",<br><br>";

	html += "<p>We received a request to reset the password associated with this email address. If you made this request, follow these instructions."+

		    "Click this link to reset your password using our secure server.</p>";

	html += "<a href='"+link+"'>Click here to reset your password</a><br><br>";

	html +="<p>If clicking on the link doesn't work, copy and paste it into the address window of your browser or retype it there. Once you return to the Dice website, you can reset your password."+

	       "If you did not request to have your password reset, then ignore this email. Your account information is still safe with us.</p>";


	html += "Thank you for using Get2Leads!,<br><br>";
	html += "Cheers,<br>";
	html += "<a href='http://Get2Leads.com'>Get2Leads</a><br><br>";
	html += "</body></html>";
	return  [{data:html, alternative:true}];
}
