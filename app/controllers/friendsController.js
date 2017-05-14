const models = require('../models');
var friendsController = {
	remove: function(req, res){
		models.friends.remove(req.params.id, req.user.user_id, function(err, result){
			if(err) 
				res.send('Error load data');
			else{
				res.redirect('/users');
			}
		});
	},

	add: function(req, res){
		models.friends.add(req.params.id, req.user.user_id, function(err, result){
			if(err) 
				res.send('Error load data');
			else{
				res.redirect('/users');
			}
		});
	},

};
module.exports = friendsController;