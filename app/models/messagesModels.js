const pool= require('../../config/database');

var moment = require('moment');
var momentNow = moment();

var strFormat='YYYY-MM-DD HH:mm:ss';


module.exports = {
	getInbox_messages: function(id_user, callback){
		pool.query('SELECT message_id, sent_time, user_name, content, seen_time FROM "Messages","Users" WHERE receiver_id=($1) and sender_id = user_id ORDER BY sent_time DESC',[id_user], function(err, result) {
            callback(err,result);
		});

	},

	postNew_messages: function(message, callback){
		var formatted = momentNow.format(strFormat);
		pool.query('INSERT INTO "Messages" (sent_time, receiver_id, sender_id, content) VALUES ($1,$2,$3,$4)',[formatted, message.receiver_id, message.sender_id, message.content], function(err, result) {
            callback(err,result);
		});

	},

	getSent_messages: function(id_user, callback){
		pool.query('SELECT message_id, sent_time, user_name, content, seen_time FROM "Messages","Users" WHERE sender_id=($1) and receiver_id = user_id ORDER BY sent_time DESC',[id_user], function(err, result) {
            callback(err,result);
		});

	},

	read_messages: function(id, callback){
		var formatted = momentNow.format(strFormat);
		pool.query('UPDATE "Messages" SET seen_time = ($1) WHERE message_id = ($2)',[formatted, id], function(err, result) {
            callback(err,result);
		});
	},
};
