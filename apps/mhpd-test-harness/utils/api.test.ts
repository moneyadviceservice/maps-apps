import { getScenarios, getScenarioById } from './api';

describe('Utility Functions', () => {
  describe('getScenarios', () => {
    it('should return data when the request is successful', async () => {
      // Arrange
      const mockData = { scenarios: ['scenario1', 'scenario2'] };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        } as Response),
      );

      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      process.env.COMPOSER_ENDPOINT_TEST = 'http://mock-endpoint-test';
      process.env.COMPOSER_ENDPOINT_STAGING = 'http://mock-endpoint-staging';

      // Act
      const result = await getScenarios();

      // Assert
      expect(result).toEqual({ data: mockData });
      expect(fetch).toHaveBeenCalledWith('http://mock-endpoint', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: expect.any(AbortSignal),
        cache: 'no-store',
      });
    });

    it('should return an error if COMPOSER_ENDPOINT is not set', async () => {
      // Arrange
      delete process.env.COMPOSER_ENDPOINT;

      // Act
      const result = await getScenarios();

      // Assert
      expect(result).toEqual({ error: 'COMPOSER_ENDPOINT is not set' });
    });

    it('should return an error if COMPOSER_ENDPOINT_TEST is not set', async () => {
      // Arrange
      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      delete process.env.COMPOSER_ENDPOINT_TEST;

      // Act
      const result = await getScenarios();

      // Assert
      expect(result).toEqual({ error: 'COMPOSER_ENDPOINT_TEST is not set' });
    });

    it('should return an error if COMPOSER_ENDPOINT_STAGING is not set', async () => {
      // Arrange
      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      process.env.COMPOSER_ENDPOINT_TEST = 'http://mock-endpoint-test';
      delete process.env.COMPOSER_ENDPOINT_STAGING;

      // Act
      const result = await getScenarios();

      // Assert
      expect(result).toEqual({ error: 'COMPOSER_ENDPOINT_STAGING is not set' });
    });

    it('should return an error if the response is empty', async () => {
      // Arrange
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response),
      );

      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      process.env.COMPOSER_ENDPOINT_TEST = 'http://mock-endpoint-test';
      process.env.COMPOSER_ENDPOINT_STAGING = 'http://mock-endpoint-staging';

      // Act
      const result = await getScenarios();

      // Assert
      expect(result).toEqual({ error: 'Scenario data not found' });
    });

    it('should return an error if the request fails', async () => {
      // Arrange
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      process.env.COMPOSER_ENDPOINT_TEST = 'http://mock-endpoint-test';
      process.env.COMPOSER_ENDPOINT_STAGING = 'http://mock-endpoint-staging';

      // Act
      const result = await getScenarios();

      // Assert
      expect(result).toEqual({ error: 'Failed to fetch scenarios' });
    });
  });

  describe('getScenarioById', () => {
    it('should return data when the request is successful', async () => {
      // Arrange
      const mockData = { id: '123', name: 'Test Scenario' };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        } as Response),
      );

      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      process.env.COMPOSER_ENDPOINT_TEST = 'http://mock-endpoint-test';

      // Act
      const result = await getScenarioById('123');

      // Assert
      expect(result).toEqual({ data: mockData });
      expect(fetch).toHaveBeenCalledWith('http://mock-endpoint/123', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: expect.any(AbortSignal),
        cache: 'no-store',
      });
    });

    it('should return an error if COMPOSER_ENDPOINT is not set', async () => {
      // Arrange
      delete process.env.COMPOSER_ENDPOINT;

      // Act
      const result = await getScenarioById('123');

      // Assert
      expect(result).toEqual({ error: 'COMPOSER_ENDPOINT is not set' });
    });

    it('should return an error if the response is not ok', async () => {
      // Arrange
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response),
      );

      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      process.env.COMPOSER_ENDPOINT_TEST = 'http://mock-endpoint-test';

      // Act
      const result = await getScenarioById('123');

      // Assert
      expect(result).toEqual({ error: 'Request failed with status 404' });
    });

    it('should return an error if the response data is empty', async () => {
      // Arrange
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response),
      );

      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      process.env.COMPOSER_ENDPOINT_TEST = 'http://mock-endpoint-test';

      // Act
      const result = await getScenarioById('123');

      // Assert
      expect(result).toEqual({ error: 'Scenario data not found' });
    });

    it('should return an error if the request fails', async () => {
      // Arrange
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      process.env.COMPOSER_ENDPOINT = 'http://mock-endpoint';
      process.env.COMPOSER_ENDPOINT_TEST = 'http://mock-endpoint-test';

      // Act
      const result = await getScenarioById('123');

      // Assert
      expect(result).toEqual({ error: 'Failed to fetch scenario' });
    });
  });
});
