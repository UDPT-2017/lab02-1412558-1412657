const pool= require('../../config/database');
module.exports = {
	getAll: function(callback){
		pool.query('SELECT user_id, user_name, user_email, user_avatar from "Users"', function(err, result) {
            callback(err,result);
		});
	}
};