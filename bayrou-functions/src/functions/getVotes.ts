
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_CONN_STRING!;
const client = new CosmosClient(endpoint);
const database = client.database("bayroudb");
const votesContainer = database.container("votes");

export async function getVotes(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    try {
        const querySpec = {
            query: "SELECT c.userId, c.isForBayrou FROM c"
        };
        const { resources: votes } = await votesContainer.items.query(querySpec).fetchAll();
        return { status: 200, body: JSON.stringify(votes) };
    } catch (err) {
        context.log("Erreur lors de la récupération des votes:", err);
        return { status: 500, body: "Erreur lors de la récupération des votes." };
    }
}

app.http('getVotes', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getVotes
});
