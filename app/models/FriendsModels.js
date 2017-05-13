const pool= require('../../config/database');
module.exports = {
	getFriendsById: function(id_user, callback){
		pool.query('SELECT friend_id, user_name as "friend_name", user_email as "friend_email" from "Friends","Users" WHERE owner_user=($1) and friend_id=user_id',[id_user], function(err, result) {
            callback(err,result);
		});

	}
};