import { config } from 'dotenv';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { fetchNetlifyAuthCookie } from './fetch-netlify-auth-cookie';

config({ path: join(process.cwd(), '.env.local') });

const storageStateFilePath = 'storageState.json';

/**
 * LambdaTest pre-launch script.
 *
 * This file is expected to be run before any LambdaTest executions.
 * If it is not, then there will be no 'storageState.json' file in root.
 * Which results in test failure.
 */
fetchNetlifyAuthCookie()
  .then((cookie) => {
    if (!cookie) {
      console.log('No cookie found, most likely no Netlify password field');
      process.exit(0);
    }

    // Save cookie for all tests
    const { hostname } = new URL(cookie.baseURL);
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
    process.exit(0);
  })
  .catch((err) => {
    throw new Error(
      `Failed to create file: "${storageStateFilePath}"\n Error: ` + err,
    );
  });
