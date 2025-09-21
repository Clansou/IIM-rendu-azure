// Utilitaires pour créer des mocks de requêtes HTTP dans les tests
import { HttpRequest, InvocationContext } from "@azure/functions";

export const createMockContext = (functionName: string): InvocationContext => ({
  invocationId: 'test-id',
  functionName,
  extraInputs: new Map(),
  extraOutputs: new Map(),
  retryContext: null,
  traceContext: null,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
} as any);

export const createMockRequest = (method: string = 'GET', body: any = {}, query?: Record<string, string>): HttpRequest => ({
  method,
  url: `https://test.azurewebsites.net/api/test`,
  headers: new Map(),
  query: {
    get: (key: string) => query?.[key] || null
  },
  params: {},
  user: null,
  text: async () => typeof body === 'string' ? body : JSON.stringify(body),
  json: async () => body,
  formData: async () => new FormData(),
  arrayBuffer: async () => new ArrayBuffer(0),
  blob: async () => new Blob([])
} as any);
