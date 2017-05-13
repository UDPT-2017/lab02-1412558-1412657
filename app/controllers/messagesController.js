var messagesController = {
	index: function(req, res){
		res.render('messages.ejs');
	},

	sent: function(req, res){
		res.render('sent-messages.ejs');
	},

	new: function(req, res){
		res.render('new-messages.ejs');
	},

	inbox: function(req, res){
		res.render('inbox-messages.ejs');
	},

	friend: function(req, res){
		res.render('friend.ejs');
	}
};
module.exports = messagesController;