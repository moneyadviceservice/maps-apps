import { writeFileSync } from 'node:fs';
import { ENV } from '@env';

import { fetchNetlifyAuthCookie } from './netlify-auth';

const storageStateFilePath = 'storageState.json';

/**
 * LambdaTest pre-launch script.
 *
 * This file is expected to be run before any LambdaTest executions.
 * If it is not, then there will be no 'storageState.json' file in root.
 * Which results in test failure.
 */
fetchNetlifyAuthCookie(ENV.BASE_URL, ENV.NETLIFY_PASSWORD)
  .then((cookie) => {
    // Save cookie for all tests
    const { hostname } = new URL(ENV.BASE_URL);
    const storageState = {
      cookies: [
        {
          name: cookie.name,
          value: cookie.value,
          domain: hostname,
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    };

    console.log('Successfully retreived and stored authentication cookie...');
    writeFileSync(storageStateFilePath, JSON.stringify(storageState));
  })
  .catch((err) => {
    throw new Error(
      `Failed to create file: "${storageStateFilePath}"\n` + 'Error: ' + err,
    );
  });
