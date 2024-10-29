// Mock console.error globally
jest.spyOn(console, 'error').mockImplementation(() => null);
jest.spyOn(console, 'log').mockImplementation(() => null);
