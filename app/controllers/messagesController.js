const messagesModels = require('../../app/models/messagesModels');
const friendsModels = require('../../app/models/friendsModels');

var messagesController = {
	index: function(req, res){
		res.render('messages.ejs');
	},

	sent: function(req, res){
		messagesModels.getSent_messages(req.user.user_id, function(err, result){
			if(err) 
				res.send('Error');
			console.log(result);
			res.render('sent-messages.ejs', {sent_list: result});
		});
	},

	new: function(req, res){
		friendsModels.getFriendsById(req.user.user_id, function(err, result){
			if(err) 
				res.send('Error');

			res.render('new-messages.ejs', {friends_list: result});
		});
	},

	postNew: function(req, res){

		var message = {
                        sender_id : req.user.user_id,                         
                        receiver_id : req.body.receiver_id,
                        content : req.body.content,
                    };

		messagesModels.postNew_messages(message, function(err, result){
			if(err) 
				res.send('Error');
			else
				res.redirect('/messages/sent-messages');
		});
	},

	inbox: function(req, res){
		messagesModels.getInbox_messages(req.user.user_id, function(err, result){
			if(err) 
				res.send('Error');
			res.render('inbox-messages.ejs', {inbox_list: result});
		});
	},

	read: function(req, res){
		messagesModels.read_messages(req.params.id, function(err, result){
			if(err) 
				res.send('Error');
			else
				res.redirect('/messages/inbox-messages');
		});
	},

	friend: function(req, res){
		res.render('friend.ejs');
	}
};
module.exports = messagesController;