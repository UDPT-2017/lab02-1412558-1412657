const friendsModels = require('../models/friendsModels');
const usersModels = require('../models/usersModels');

var friendsController = {
	remove: function(req, res){
		friendsModels.remove(req.params.id, req.user.user_id, function(err, result){
			if(err) 
				res.send('Error load data');
			else{
				res.redirect('/users');
			}
		});
	},

	add: function(req, res){
		friendsModels.add(req.params.id, req.user.user_id, function(err, result){
			if(err) 
				res.send('Error load data');
			else{
				res.redirect('/users');
			}
		});
	},

};
module.exports = friendsController;