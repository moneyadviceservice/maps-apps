import MockApiServer from './mockApiServer';

export const e2eNodeEvents: Cypress.Config['e2e']['setupNodeEvents'] = (on) => {
  const mockApiServer = new MockApiServer();

  on('before:run', () => {
    mockApiServer.start();
  });

  on('after:run', () => {
    mockApiServer.stop();
  });

  on('task', {
    mockApiGetResponse({ endpoint, responseData }) {
      mockApiServer.mockGetResponse({ endpoint, responseData });
      return null;
    },

    mockApiGetErrorResponse({ endpoint, responseError }) {
      mockApiServer.mockGetErrorResponse({ endpoint, responseError });
      return null;
    },

    mockApiPostResponse({ endpoint }) {
      mockApiServer.mockPostResponse({ endpoint });
      return null;
    },

    mockApiPostErrorResponse({ endpoint, responseError }) {
      mockApiServer.mockPostErrorResponse({ endpoint, responseError });
      return null;
    },

    resetApiMocks() {
      mockApiServer.reset();
      return null;
    },
    log(message) {
      console.log(message);
      return null;
    },
  });
};
