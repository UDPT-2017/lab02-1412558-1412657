const pool= require('../../config/database');
module.exports = {
	getFriendsById: function(id_user, callback){
		pool.query('SELECT friend_id, user_name as "friend_name", user_email as "friend_email" from "Friends","Users" WHERE owner_user=($1) and friend_id=user_id',[id_user], function(err, result) {
            callback(err,result);
		});
	},

	getFriendsIdById: function(id_user, callback){
		pool.query('SELECT friend_id from "Friends" WHERE owner_user=($1)',[id_user], function(err, result) {
            callback(err,result);
		});
	},

	remove: function(id_friend, id_user, callback){
		pool.query('DELETE FROM "Friends" WHERE owner_user=($1) and friend_id=($2)',[id_user, id_friend], function(err, result) {
            callback(err,result);
		});
	},

	add: function(id_friend, id_user, callback){
		pool.query('INSERT INTO "Friends" (owner_user, friend_id) VALUES ($1,$2)',[id_user, id_friend], function(err, result) {
            callback(err,result);
		});
	},

};