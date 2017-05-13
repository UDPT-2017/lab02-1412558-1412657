const pool= require('../../config/database');
module.exports = {
	getFriendsById: function(id_user, callback){
		pool.query('SELECT * FROM "Friends" WHERE owner_user = ($1)',[id_user], function(err, result) {
            callback(err,result);
		});

	}
};