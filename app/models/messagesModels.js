const pool= require('../../config/database');
module.exports = {
	getInbox_messages: function(id_user, callback){
		pool.query('SELECT sent_time, user_name, content, seen_time FROM "Messages","Users" WHERE receiver_id=($1) and sender_id = user_id',[id_user], function(err, result) {
            callback(err,result);
		});

	},

	postNew_messages: function(message, callback){
		pool.query('SELECT * FROM "Messages" WHERE receiver_id = ($1)',[id_user], function(err, result) {
            callback(err,result);
		});

	},
};
