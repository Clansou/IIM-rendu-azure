import { postVote } from "../src/functions/postVote";
import { createMockContext, createMockRequest } from "./testUtils";

// Mock Cosmos DB
jest.mock("@azure/cosmos", () => {
  const mockFetchAll = jest.fn();
  const mockCreate = jest.fn();
  const mockQuery = jest.fn(() => ({ fetchAll: mockFetchAll }));
  
  return {
    CosmosClient: jest.fn().mockImplementation(() => ({
      database: jest.fn().mockReturnValue({
        container: jest.fn().mockReturnValue({
          items: { query: mockQuery, create: mockCreate }
        })
      })
    })),
    __mockFetchAll: mockFetchAll,
    __mockCreate: mockCreate,
    __mockQuery: mockQuery
  };
});

const { CosmosClient } = require("@azure/cosmos");
const mockFetchAll = (CosmosClient as any).__mockFetchAll;
const mockCreate = (CosmosClient as any).__mockCreate;

describe('postVote Function', () => {
  const mockContext = createMockContext('postVote');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create vote successfully for Bayrou', async () => {
    const voteData = { userId: 'user123', isForBayrou: true };
    const createdVote = { id: 'vote1', ...voteData };

    mockFetchAll.mockResolvedValue({ resources: [] });
    mockCreate.mockResolvedValue({ resource: createdVote });

    const request = createMockRequest('POST', voteData);
    const response = await postVote(request, mockContext);

    expect(response.status).toBe(201);
    expect(JSON.parse(response.body as string)).toEqual(createdVote);
  });

  test('should return 400 when userId is missing', async () => {
    const request = createMockRequest('POST', { isForBayrou: true });
    
    const response = await postVote(request, mockContext);
    
    expect(response.status).toBe(400);
    expect(response.body).toBe('userId et isForBayrou (booléen) requis.');
  });

  test('should return 409 when user has already voted', async () => {
    const voteData = { userId: 'user123', isForBayrou: true };
    const existingVote = { id: 'existing-vote', userId: 'user123', isForBayrou: false };

    mockFetchAll.mockResolvedValue({ resources: [existingVote] });

    const request = createMockRequest('POST', voteData);
    const response = await postVote(request, mockContext);

    expect(response.status).toBe(409);
    expect(response.body).toBe('Cet utilisateur a déjà voté.');
  });
});
