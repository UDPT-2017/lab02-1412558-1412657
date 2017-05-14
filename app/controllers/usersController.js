const models = require('../models');
var usersController = {
	index: function(req, res){
		models.users.getAll(req.user.user_id, function(err, result1){
			if(err) 
				res.send('Error load data');
			else{
					models.friends.getFriendsIdById(req.user.user_id, function(err, result2){
					if(err) 
						res.send('Error load data');
					else{
							res.render('users.ejs', {users_list: result1, friends_list: result2});
					}
				});
			}
		});
	},
};
module.exports = usersController;