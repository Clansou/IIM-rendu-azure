"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var functions_1 = require("@azure/functions");
var cosmos_1 = require("@azure/cosmos");
var endpoint = process.env.COSMOS_CONN_STRING;
var client = new cosmos_1.CosmosClient(endpoint);
var database = client.database("bayroudb");
var usersContainer = database.container("users");
functions_1.app.http('loginUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: function (request, context) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, pseudo, email, querySpec, users;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, request.json()];
                case 1:
                    _a = _b.sent(), pseudo = _a.pseudo, email = _a.email;
                    if (!pseudo || !email) {
                        return [2 /*return*/, { status: 400, body: "Pseudo et email requis." }];
                    }
                    querySpec = {
                        query: "SELECT * FROM c WHERE c.pseudo = @pseudo AND c.email = @email",
                        parameters: [
                            { name: "@pseudo", value: pseudo },
                            { name: "@email", value: email }
                        ]
                    };
                    return [4 /*yield*/, usersContainer.items.query(querySpec).fetchAll()];
                case 2:
                    users = (_b.sent()).resources;
                    if (users.length > 0) {
                        return [2 /*return*/, { status: 200, jsonBody: { message: "Connexion réussie", user: users[0] } }];
                    }
                    else {
                        return [2 /*return*/, { status: 401, body: "Utilisateur non trouvé ou informations incorrectes." }];
                    }
                    return [2 /*return*/];
            }
        });
    }); }
});
