/*eslint-disable no-console */
import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';
import { getStore } from '@netlify/blobs';

import { Entry } from '../../lib/types';
import { loadEnv } from '../loadEnv';

/**
 * Initialise an entry with a reference of the session cookie
 * @param context
 * @param flow - The flow to used in the initialised session.
 * @returns {Promise<void>}
 */
export async function initialiseSession(
  context: GetServerSidePropsContext,
): Promise<void> {
  const { req, res } = context;
  if (!req || !res) {
    throw new Error('Request and response objects are required');
  }

  const cookies = new Cookies(req, res);
  const key = crypto.randomUUID();

  // Set the session cookie
  cookies.set('fsid', key, {
    httpOnly: true,
    path: '/',
  });

  // Create metadata for the entry
  const metadata = {
    createdAt: new Date().toISOString(),
  };

  // Initialize the entry with default values
  const entry: Entry = {
    data: {},
    errors: [],
  };

  // Store the updated records
  const { storeName } = loadEnv();
  const store = getStore({ name: storeName, consistency: 'strong' });

  // Construct the store value key
  await store.setJSON(key, entry, { metadata });

  console.warn('Initialized new session StoreEntry:', entry); // DEBUG
}
