const messagesModels = require('../../app/models/messagesModels');
const friendsModels = require('../../app/models/friendsModels');

var messagesController = {
	index: function(req, res){
		res.render('messages.ejs');
	},

	sent: function(req, res){
		res.render('sent-messages.ejs');
	},

	new: function(req, res){
		friendsModels.getFriendsById(req.user.id, function(err, result){
			if(err) 
				res.send('Error');
			res.render('new-messages.ejs', {friends_list: result});
		});
	},

	postNew: function(req, res){

		var message = {
                        id_sender : req.user.id,               
                        name_sender: req.user.name,            
                        id_receiver : req.body.id_receiver,
                        content : req.body.content,
                    };

		messagesModels.postNew_messages(message, function(err, result){
			if(err) 
				res.send('Error');
			res.render('new-messages.ejs');
		});
	},

	inbox: function(req, res){
		messagesModels.getInbox_messages(req.user.user_id, function(err, result){
			if(err) 
				res.send('Error');

			console.log(req.user.user_id);

			res.render('inbox-messages.ejs', {inbox_list: result});
		});
	},

	friend: function(req, res){
		res.render('friend.ejs');
	}
};
module.exports = messagesController;