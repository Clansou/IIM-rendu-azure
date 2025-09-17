import { app } from '@azure/functions';
import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_CONN_STRING;
const client = new CosmosClient(endpoint);
const database = client.database("bayroudb");
const usersContainer = database.container("users");

app.http('loginUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const { pseudo, email } = await request.json() as any;

        if (!pseudo || !email) {
            return { status: 400, body: "Pseudo et email requis." };
        }

        // Cherche l'utilisateur dans la base
        const querySpec = {
            query: "SELECT * FROM c WHERE c.pseudo = @pseudo AND c.email = @email",
            parameters: [
                { name: "@pseudo", value: pseudo },
                { name: "@email", value: email }
            ]
        };

        const { resources: users } = await usersContainer.items.query(querySpec).fetchAll();

        if (users.length > 0) {
            return { status: 200, jsonBody: { message: "Connexion réussie", user: users[0] } };
        } else {
            return { status: 401, body: "Utilisateur non trouvé ou informations incorrectes." };
        }
    }
});