import { app } from '@azure/functions';

// Import all function files to register them
import './functions/createUser';
import './functions/getHealth';
import './functions/getVotes';
import './functions/loginUser';
import './functions/postVote';

export default app;
