import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_CONN_STRING!;
const client = new CosmosClient(endpoint);
const database = client.database("bayroudb");
const votesContainer = database.container("votes");

export async function postVote(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const { userId, isForBayrou } = await request.json() as { userId: string; isForBayrou: boolean };
        if (!userId || typeof isForBayrou !== "boolean") {
            return { status: 400, body: "userId et isForBayrou (booléen) requis." };
        }
        const querySpec = {
            query: "SELECT * FROM c WHERE c.userId = @userId",
            parameters: [
                { name: "@userId", value: userId }
            ]
        };
        const { resources: votes } = await votesContainer.items.query(querySpec).fetchAll();
        if (votes.length > 0) {
            return { status: 409, body: "Cet utilisateur a déjà voté." };
        }
        // Ajoute le vote
        const { resource } = await votesContainer.items.create({ userId, isForBayrou });
        return { status: 201, body: JSON.stringify(resource) };
    } catch (err) {
        context.log("Erreur lors de l'enregistrement du vote:", err);
        return { status: 500, body: "Erreur lors de l'enregistrement du vote." };
    }
}

app.http('postVote', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: postVote
});
