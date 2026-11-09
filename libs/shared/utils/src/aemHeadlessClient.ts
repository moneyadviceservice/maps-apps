import { AEMHeadless } from '@adobe/aem-headless-client-nodejs';

export const aemHeadlessClient = new AEMHeadless({
  serviceURL: process.env.AEM_HOST,
  endpoint: 'content/graphql/endpoint.gql',
  auth: [process.env.AEM_USERNAME, process.env.AEM_PASSWORD],
  fetch: (url: string, options: RequestInit = {}) => {
    if (process.env.AEM_USERAGENT) {
      options.headers = {
        ...options.headers,
        'User-Agent': process.env.AEM_USERAGENT,
      };
    }
    return fetch(url, options);
  },
});

export default aemHeadlessClient;
