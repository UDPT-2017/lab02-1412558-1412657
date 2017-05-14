const pool= require('../../config/database');
module.exports = {
	getAll: function(id_user, callback){
		pool.query('SELECT user_id, user_name, user_email, user_avatar from "Users" WHERE user_id !=($1)',[id_user], function(err, result) {
            callback(err,result);
		});
	},
};