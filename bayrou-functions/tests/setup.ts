// Configuration globale pour les tests
// Ce fichier est exécuté avant tous les tests

// Mock des variables d'environnement
process.env.COSMOS_CONN_STRING = 'https://test-cosmos.documents.azure.com:443/';

// Mock global console pour éviter les logs pendant les tests
const originalConsole = global.console;

beforeAll(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  global.console = originalConsole;
});
