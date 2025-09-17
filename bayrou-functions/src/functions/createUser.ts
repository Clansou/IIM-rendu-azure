import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_CONN_STRING!;
const client = new CosmosClient(endpoint);
const database = client.database("bayroudb");
const usersContainer = database.container("users");

export async function createUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const { pseudo, email } = await request.json() as { pseudo?: string; email?: string };
    if (!pseudo || !email) {
        return { status: 400, body: "Pseudo et email requis." };
    }
    try {
        const querySpec = {
            query: "SELECT * FROM c WHERE c.pseudo = @pseudo OR c.email = @email",
            parameters: [
                { name: "@pseudo", value: pseudo },
                { name: "@email", value: email }
            ]
        };
        const { resources: users } = await usersContainer.items.query(querySpec).fetchAll();
        if (users.length > 0) {
            return { status: 409, body: "Utilisateur déjà existant." };
        }
        // Crée l'utilisateur
        const { resource } = await usersContainer.items.create({ pseudo, email });
        return { status: 201, body: JSON.stringify(resource) };
    } catch (err) {
        return { status: 500, body: "Erreur lors de la création de l'utilisateur." };
    }
}

app.http('createUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: createUser
});
