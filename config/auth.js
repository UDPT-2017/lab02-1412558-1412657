module.exports = {

    'facebookAuth' : {
        'clientID'      : '1304675552973165', // your App ID
        'clientSecret'  : '74ef2a02bcb69e4d28e18fe5bc0f39c2', // your App Secret
        'callbackURL'   : 'https://lab01-1412558-1412657.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8888/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8888/auth/google/callback'
    }

};