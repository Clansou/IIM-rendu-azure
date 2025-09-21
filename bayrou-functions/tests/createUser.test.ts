import { createUser } from "../src/functions/createUser";
import { createMockContext, createMockRequest } from "./testUtils";

// Mock Cosmos DB
jest.mock("@azure/cosmos", () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn().mockReturnValue({
      container: jest.fn().mockReturnValue({
        items: {
          query: jest.fn().mockReturnValue({
            fetchAll: jest.fn()
          }),
          create: jest.fn()
        }
      })
    })
  }))
}));

describe('createUser Function', () => {
  const mockContext = createMockContext('createUser');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 when pseudo is missing', async () => {
    const request = createMockRequest('POST', { email: 'test@test.com' });
    
    const response = await createUser(request, mockContext);
    
    expect(response.status).toBe(400);
    expect(response.body).toBe('Pseudo et email requis.');
  });

  test('should return 400 when email is missing', async () => {
    const request = createMockRequest('POST', { pseudo: 'testuser' });
    
    const response = await createUser(request, mockContext);
    
    expect(response.status).toBe(400);
    expect(response.body).toBe('Pseudo et email requis.');
  });

  test('should return 400 when both pseudo and email are missing', async () => {
    const request = createMockRequest('POST', {});
    
    const response = await createUser(request, mockContext);
    
    expect(response.status).toBe(400);
    expect(response.body).toBe('Pseudo et email requis.');
  });

  // Note: Les tests avec Cosmos DB nécessiteraient des mocks plus complexes
  // ou l'utilisation d'un émulateur Cosmos DB pour les tests d'intégration
});
