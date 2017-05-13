const pool= require('../../config/database');

var moment = require('moment');
var momentNow = moment();
var formatted = momentNow.format('YYYY-MM-DD HH:mm:ss');

module.exports = {
	getInbox_messages: function(id_user, callback){
		pool.query('SELECT sent_time, user_name, content, seen_time FROM "Messages","Users" WHERE receiver_id=($1) and sender_id = user_id',[id_user], function(err, result) {
            callback(err,result);
		});

	},

	postNew_messages: function(message, callback){
		pool.query('INSERT INTO "Messages"("sent_time", "receiver_id", "sender_id", "content", "seen_time") VALUES ($1,%2,%3,$4,%5)',[formatted,message.receiver_id, message.sender_id, message.content, null], function(err, result) {
            callback(err,result);
		});

	},
};
