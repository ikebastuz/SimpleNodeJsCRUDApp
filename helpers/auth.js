module.exports = {
	ensureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}else{
			req.flash('error_msg', 'You have no permission to go there');
			res.redirect('/users/login');
		}
	}
}