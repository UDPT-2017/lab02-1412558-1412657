const friendsModels = require('../../app/models/friendsModels');
const usersModels = require('../../app/models/usersModels');

var usersController = {
	index: function(req, res){
		usersModels.getAll(function(err, result1){
			if(err) 
				res.send('Error load data');
			else{
					friendsModels.getFriendsById(req.user.user_id, function(err, result2){
					if(err) 
						res.send('Error load data');
					else{
							console.log(result1);
							console.log('----------------------------');
							console.log(result2);
							res.render('users.ejs', {users_list: result1, friends_list: result2});
					}
				});
			}
		});
	},
};
module.exports = usersController;