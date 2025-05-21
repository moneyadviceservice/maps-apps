import { getLocal, type Mockttp } from 'mockttp';

class MockApiServer {
  private readonly server: Mockttp;
  private readonly port: number;

  constructor() {
    this.server = getLocal();
    this.port = 9000; // < Make sure this matches the port in your custom API_URL env url
  }

  reset() {
    this.server.reset();
  }

  start() {
    this.server.start(this.port);
    this.server
      .forGet('/')
      .thenReply(200, 'Mock API server is up')
      .then(() => {
        console.info(
          `\n📡 Mock API server running on http://localhost:${this.port}\n`,
        );
      });
  }

  stop() {
    this.server.stop().then(() => {
      console.info(`📡 Mock API server stopped`);
    });
  }

  mockGetResponse({
    endpoint,
    responseData,
  }: {
    endpoint: string;
    responseData: Array<unknown>;
  }) {
    this.server
      .forGet(`/${endpoint}`)
      .thenJson(200, responseData)
      .then(() => {
        console.info(
          `\n📡 Mock API server get request ${endpoint} with success \n`,
        );
      });
  }

  mockGetErrorResponse({
    endpoint,
    responseError,
  }: {
    endpoint: string;
    responseError: string;
  }) {
    this.server
      .forGet(`/${endpoint}`)
      .thenReply(400, responseError)
      .then(() => {
        console.info(
          `\n📡 Mock API server get request ${endpoint} with error response ${responseError}\n`,
        );
      });
  }

  mockPostResponse({ endpoint }: { endpoint: string }) {
    this.server
      .forPost(`/${endpoint}`)
      .thenReply(200)
      .then(() => {
        console.info(
          `\n📡 Mock API server post ${endpoint} success response \n`,
        );
      });
  }

  mockPostErrorResponse({
    endpoint,
    responseError,
  }: {
    endpoint: string;
    responseError: string;
  }) {
    this.server
      .forPost(`/${endpoint}`)
      .thenReply(400, responseError)
      .then(() => {
        console.info(`\n📡 Mock API server post ${endpoint} error response \n`);
      });
  }
}

export default MockApiServer;
