import { HttpRequest, InvocationContext } from "@azure/functions";

// Mock Cosmos DB
const mockFetchAll = jest.fn();
const mockQuery = jest.fn().mockReturnValue({
  fetchAll: mockFetchAll
});

jest.mock("@azure/cosmos", () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn().mockReturnValue({
      container: jest.fn().mockReturnValue({
        items: {
          query: mockQuery
        }
      })
    })
  }))
}));

// Import the handler function (it's defined inline in the file)
// We need to import it in a special way since it's not exported
let loginUserHandler: any;

// Mock the app registration to capture the handler
jest.mock('@azure/functions', () => ({
  app: {
    http: jest.fn().mockImplementation((name, config) => {
      if (name === 'loginUser') {
        loginUserHandler = config.handler;
      }
    })
  }
}));

// Import the module to trigger the app.http registration
require('../src/functions/loginUser');

// Mock pour InvocationContext
const mockContext: InvocationContext = {
  invocationId: 'test-id',
  functionName: 'loginUser',
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

// Mock pour HttpRequest
const createMockRequest = (body: any): HttpRequest => ({
  method: 'POST',
  url: 'https://test.azurewebsites.net/api/loginUser',
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

describe('loginUser Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should login successfully with valid credentials', async () => {
    const loginData = { pseudo: 'testuser', email: 'test@example.com' };
    const mockUser = { id: 'user1', pseudo: 'testuser', email: 'test@example.com' };

    mockFetchAll.mockResolvedValue({ resources: [mockUser] });

    const request = createMockRequest(loginData);
    const response = await loginUserHandler(request, mockContext);

    expect(response.status).toBe(200);
    expect(response.jsonBody).toEqual({
      message: 'Connexion réussie',
      user: mockUser
    });
  });

  test('should return 400 when pseudo is missing', async () => {
    const request = createMockRequest({ email: 'test@example.com' });
    
    const response = await loginUserHandler(request, mockContext);
    
    expect(response.status).toBe(400);
    expect(response.body).toBe('Pseudo et email requis.');
  });

  test('should return 400 when email is missing', async () => {
    const request = createMockRequest({ pseudo: 'testuser' });
    
    const response = await loginUserHandler(request, mockContext);
    
    expect(response.status).toBe(400);
    expect(response.body).toBe('Pseudo et email requis.');
  });

  test('should return 400 when both pseudo and email are missing', async () => {
    const request = createMockRequest({});
    
    const response = await loginUserHandler(request, mockContext);
    
    expect(response.status).toBe(400);
    expect(response.body).toBe('Pseudo et email requis.');
  });

  test('should return 401 when user is not found', async () => {
    const loginData = { pseudo: 'wronguser', email: 'wrong@example.com' };

    mockFetchAll.mockResolvedValue({ resources: [] });

    const request = createMockRequest(loginData);
    const response = await loginUserHandler(request, mockContext);

    expect(response.status).toBe(401);
    expect(response.body).toBe('Utilisateur non trouvé ou informations incorrectes.');
  });

  test('should return 401 when email does not match', async () => {
    const loginData = { pseudo: 'testuser', email: 'wrong@example.com' };

    mockFetchAll.mockResolvedValue({ resources: [] });

    const request = createMockRequest(loginData);
    const response = await loginUserHandler(request, mockContext);

    expect(response.status).toBe(401);
    expect(response.body).toBe('Utilisateur non trouvé ou informations incorrectes.');
  });

  test('should use correct query specification', async () => {
    const loginData = { pseudo: 'testuser', email: 'test@example.com' };
    
    mockFetchAll.mockResolvedValue({ resources: [] });

    const request = createMockRequest(loginData);
    await loginUserHandler(request, mockContext);

    expect(mockQuery).toHaveBeenCalledWith({
      query: "SELECT * FROM c WHERE c.pseudo = @pseudo AND c.email = @email",
      parameters: [
        { name: "@pseudo", value: "testuser" },
        { name: "@email", value: "test@example.com" }
      ]
    });
  });

  test('should handle multiple users with same credentials (should not happen but test edge case)', async () => {
    const loginData = { pseudo: 'testuser', email: 'test@example.com' };
    const mockUsers = [
      { id: 'user1', pseudo: 'testuser', email: 'test@example.com' },
      { id: 'user2', pseudo: 'testuser', email: 'test@example.com' }
    ];

    mockFetchAll.mockResolvedValue({ resources: mockUsers });

    const request = createMockRequest(loginData);
    const response = await loginUserHandler(request, mockContext);

    expect(response.status).toBe(200);
    expect(response.jsonBody.user).toEqual(mockUsers[0]); // Should return first user
  });
});
