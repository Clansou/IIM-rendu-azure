const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_CONN_STRING;
const client = new CosmosClient(endpoint);
const database = client.database("bayroudb");
const usersContainer = database.container("users");

module.exports = async function (context, req) {
    const { pseudo, email } = req.body;

    if (!pseudo || !email) {
        context.res = { status: 400, body: "Pseudo et email requis." };
        return;
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
        context.res = { status: 200, body: { message: "Connexion réussie", user: users[0] } };
    } else {
        context.res = { status: 401, body: "Utilisateur non trouvé ou informations incorrectes." };
    }
};