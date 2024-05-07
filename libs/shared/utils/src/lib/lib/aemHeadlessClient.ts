import { AEMHeadless } from '@adobe/aem-headless-client-nodejs';

export const aemHeadlessClient = new AEMHeadless({
  serviceURL: process.env.AEM_HOST,
  endpoint: 'content/graphql/endpoint.gql',
  auth: [process.env.AEM_USERNAME, process.env.AEM_PASSWORD],
});

export default aemHeadlessClient;
