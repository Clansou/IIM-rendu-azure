const { app } = require('@azure/functions');

// Import all functions
require('./functions/createUser');
require('./functions/getHealth');
require('./functions/getVotes');
require('./functions/loginUser');
require('./functions/postVote');

module.exports = app;
