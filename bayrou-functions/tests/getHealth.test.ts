import { getHealth } from "../src/functions/getHealth";
import { createMockContext, createMockRequest } from "./testUtils";

describe('getHealth Function', () => {
  const mockContext = createMockContext('getHealth');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return default greeting when no name provided', async () => {
    const request = createMockRequest('GET', '');
    
    const response = await getHealth(request, mockContext);
    
    expect(response.body).toBe('Hello, world!');
    expect(mockContext.log).toHaveBeenCalledWith(
      'Http function processed request for url "https://test.azurewebsites.net/api/test"'
    );
  });

  test('should return greeting with name from query parameter', async () => {
    const request = createMockRequest('GET', {}, { name: 'Azure' });
    
    const response = await getHealth(request, mockContext);
    
    expect(response.body).toBe('Hello, Azure!');
  });

  test('should return greeting with name from request body', async () => {
    const request = createMockRequest('POST', 'Functions');
    
    const response = await getHealth(request, mockContext);
    
    expect(response.body).toBe('Hello, Functions!');
  });

  test('should prioritize query parameter over request body', async () => {
    const request = createMockRequest('POST', 'Body', { name: 'Query' });
    
    const response = await getHealth(request, mockContext);
    
    expect(response.body).toBe('Hello, Query!');
  });
});
