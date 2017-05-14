module.exports = {

    'facebookAuth' : {
        'clientID'      : '383861542007494', // your App ID
        'clientSecret'  : '2d00a94a92545f8154a8695f2e73f24d', // your App Secret
        'callbackURL'   : 'https://lab02-1412558-1412657.herokuapp.com/auth/facebook/callback'
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