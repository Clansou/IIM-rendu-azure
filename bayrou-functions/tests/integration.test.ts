// Tests d'intégration pour vérifier les scénarios complets
import { HttpRequest, InvocationContext } from "@azure/functions";

// Mock global pour Cosmos DB - simulation d'un workflow complet
const mockDatabase = {
  users: [] as any[],
  votes: [] as any[]
};

const mockFetchAll = jest.fn();
const mockCreate = jest.fn();
const mockQuery = jest.fn().mockReturnValue({
  fetchAll: mockFetchAll
});

jest.mock("@azure/cosmos", () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn().mockReturnValue({
      container: jest.fn().mockImplementation((containerName: string) => ({
        items: {
          query: mockQuery,
          create: mockCreate
        }
      }))
    })
  }))
}));

// Import functions
import { createUser } from "../src/functions/createUser";
import { getVotes } from "../src/functions/getVotes";
import { postVote } from "../src/functions/postVote";

const mockContext: InvocationContext = {
  invocationId: 'test-id',
  functionName: 'integration-test',
  extraInputs: new Map(),
  extraOutputs: new Map(),
  retryContext: null,
  traceContext: null,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
} as any;

const createMockRequest = (method: string, body: any = {}): HttpRequest => ({
  method,
  url: `https://test.azurewebsites.net/api/test`,
  headers: new Map(),
  query: { get: () => null },
  params: {},
  user: null,
  text: async () => JSON.stringify(body),
  json: async () => body,
  formData: async () => new FormData(),
  arrayBuffer: async () => new ArrayBuffer(0),
  blob: async () => new Blob([])
} as any);

describe('Voting System Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabase.users = [];
    mockDatabase.votes = [];
  });

  test('Complete voting workflow: create user -> vote -> get votes', async () => {
    // Étape 1: Créer un utilisateur
    const userData = { pseudo: 'voter1', email: 'voter1@example.com' };
    const createdUser = { id: 'user1', ...userData };

    // Mock pour la création d'utilisateur (aucun utilisateur existant)
    mockFetchAll.mockResolvedValueOnce({ resources: [] }); // Check existing user
    mockCreate.mockResolvedValueOnce({ resource: createdUser }); // Create user

    const createUserRequest = createMockRequest('POST', userData);
    const createUserResponse = await createUser(createUserRequest, mockContext);

    expect(createUserResponse.status).toBe(201);
    expect(JSON.parse(createUserResponse.body as string)).toEqual(createdUser);

    // Étape 2: L'utilisateur vote pour Bayrou
    const voteData = { userId: createdUser.id, isForBayrou: true };
    const createdVote = { id: 'vote1', ...voteData };

    // Mock pour le vote (aucun vote existant pour cet utilisateur)
    mockFetchAll.mockResolvedValueOnce({ resources: [] }); // Check existing vote
    mockCreate.mockResolvedValueOnce({ resource: createdVote }); // Create vote

    const voteRequest = createMockRequest('POST', voteData);
    const voteResponse = await postVote(voteRequest, mockContext);

    expect(voteResponse.status).toBe(201);
    expect(JSON.parse(voteResponse.body as string)).toEqual(createdVote);

    // Étape 3: Récupérer tous les votes
    const allVotes = [createdVote];
    mockFetchAll.mockResolvedValueOnce({ resources: allVotes });

    const getVotesRequest = createMockRequest('GET');
    const getVotesResponse = await getVotes(getVotesRequest, mockContext);

    expect(getVotesResponse.status).toBe(200);
    expect(JSON.parse(getVotesResponse.body as string)).toEqual(allVotes);
  });

  test('Multiple users voting scenario', async () => {
    // Simuler plusieurs utilisateurs qui votent
    const votes = [
      { userId: 'user1', isForBayrou: true },
      { userId: 'user2', isForBayrou: false },
      { userId: 'user3', isForBayrou: true },
      { userId: 'user4', isForBayrou: false },
      { userId: 'user5', isForBayrou: true }
    ];

    // Mock pour récupérer tous les votes
    mockFetchAll.mockResolvedValue({ resources: votes });

    const getVotesRequest = createMockRequest('GET');
    const response = await getVotes(getVotesRequest, mockContext);

    expect(response.status).toBe(200);
    const returnedVotes = JSON.parse(response.body as string);
    expect(returnedVotes).toHaveLength(5);

    // Vérifier la répartition des votes
    const bayRouVotes = returnedVotes.filter((vote: any) => vote.isForBayrou);
    const againstBayRouVotes = returnedVotes.filter((vote: any) => !vote.isForBayrou);

    expect(bayRouVotes).toHaveLength(3);
    expect(againstBayRouVotes).toHaveLength(2);
  });

  test('Prevent duplicate voting', async () => {
    const userId = 'user1';
    const voteData = { userId, isForBayrou: true };
    const existingVote = { id: 'existing-vote', userId, isForBayrou: false };

    // Premier vote (simuler qu'il existe déjà)
    mockFetchAll.mockResolvedValue({ resources: [existingVote] });

    const voteRequest = createMockRequest('POST', voteData);
    const response = await postVote(voteRequest, mockContext);

    expect(response.status).toBe(409);
    expect(response.body).toBe('Cet utilisateur a déjà voté.');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Error handling across the system', async () => {
    // Test d'erreur lors de la récupération des votes
    mockFetchAll.mockRejectedValue(new Error('Database connection failed'));

    const getVotesRequest = createMockRequest('GET');
    const response = await getVotes(getVotesRequest, mockContext);

    expect(response.status).toBe(500);
    expect(response.body).toBe('Erreur lors de la récupération des votes.');
    expect(mockContext.log).toHaveBeenCalledWith(
      'Erreur lors de la récupération des votes:',
      expect.any(Error)
    );
  });
});
