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
exports.postVote = void 0;
var functions_1 = require("@azure/functions");
var cosmos_1 = require("@azure/cosmos");
var endpoint = process.env.COSMOS_CONN_STRING;
var client = new cosmos_1.CosmosClient(endpoint);
var database = client.database("bayroudb");
var votesContainer = database.container("votes");
function postVote(request, context) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userId, isForBayrou, querySpec, votes, resource, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    context.log("Http function processed request for url \"".concat(request.url, "\""));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, request.json()];
                case 2:
                    _a = _b.sent(), userId = _a.userId, isForBayrou = _a.isForBayrou;
                    if (!userId || typeof isForBayrou !== "boolean") {
                        return [2 /*return*/, { status: 400, body: "userId et isForBayrou (booléen) requis." }];
                    }
                    querySpec = {
                        query: "SELECT * FROM c WHERE c.userId = @userId",
                        parameters: [
                            { name: "@userId", value: userId }
                        ]
                    };
                    return [4 /*yield*/, votesContainer.items.query(querySpec).fetchAll()];
                case 3:
                    votes = (_b.sent()).resources;
                    if (votes.length > 0) {
                        return [2 /*return*/, { status: 409, body: "Cet utilisateur a déjà voté." }];
                    }
                    return [4 /*yield*/, votesContainer.items.create({ userId: userId, isForBayrou: isForBayrou })];
                case 4:
                    resource = (_b.sent()).resource;
                    return [2 /*return*/, { status: 201, body: JSON.stringify(resource) }];
                case 5:
                    err_1 = _b.sent();
                    context.log("Erreur lors de l'enregistrement du vote:", err_1);
                    return [2 /*return*/, { status: 500, body: "Erreur lors de l'enregistrement du vote." }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.postVote = postVote;
functions_1.app.http('postVote', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: postVote
});
