import { getVotes } from "../src/functions/getVotes";
import { createMockContext, createMockRequest } from "./testUtils";

// Mock Cosmos DB
jest.mock("@azure/cosmos", () => {
  const mockFetchAll = jest.fn();
  const mockQuery = jest.fn(() => ({ fetchAll: mockFetchAll }));
  
  return {
    CosmosClient: jest.fn().mockImplementation(() => ({
      database: jest.fn().mockReturnValue({
        container: jest.fn().mockReturnValue({
          items: { query: mockQuery }
        })
      })
    })),
    __mockFetchAll: mockFetchAll,
    __mockQuery: mockQuery
  };
});

const { CosmosClient } = require("@azure/cosmos");
const mockFetchAll = (CosmosClient as any).__mockFetchAll;
const mockQuery = (CosmosClient as any).__mockQuery;

describe('getVotes Function', () => {
  const mockContext = createMockContext('getVotes');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return votes successfully', async () => {
    const mockVotes = [
      { userId: 'user1', isForBayrou: true },
      { userId: 'user2', isForBayrou: false },
      { userId: 'user3', isForBayrou: true }
    ];

    mockFetchAll.mockResolvedValue({ resources: mockVotes });

    const request = createMockRequest('GET');
    const response = await getVotes(request, mockContext);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.body as string)).toEqual(mockVotes);
  });

  test('should return empty array when no votes exist', async () => {
    mockFetchAll.mockResolvedValue({ resources: [] });

    const request = createMockRequest('GET');
    const response = await getVotes(request, mockContext);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.body as string)).toEqual([]);
  });

  test('should handle database errors', async () => {
    mockFetchAll.mockRejectedValue(new Error('Database connection failed'));

    const request = createMockRequest('GET');
    const response = await getVotes(request, mockContext);

    expect(response.status).toBe(500);
    expect(response.body).toBe('Erreur lors de la récupération des votes.');
  });
});
