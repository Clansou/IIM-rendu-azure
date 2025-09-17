import { app } from '@azure/functions';

// Import all functions to register them
import './functions/createUser.js';
import './functions/getHealth.js';
import './functions/getVotes.js';
import './functions/loginUser.js';
import './functions/postVote.js';

export default app;
