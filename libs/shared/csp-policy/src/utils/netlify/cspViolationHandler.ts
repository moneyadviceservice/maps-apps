import { getStore } from '@netlify/blobs';
import { Context } from '@netlify/functions';

export interface CSPViolationHandlerOptions {
  appName: string;
  blobStoreName?: string;
}

export async function cspViolationHandler(
  req: Request,
  context: Context,
  options: CSPViolationHandlerOptions,
) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { appName, blobStoreName = `${appName}CSPViolationsBlob` } = options;

  try {
    const randomUUID = Buffer.from(crypto.randomUUID()).toString('base64');
    const store = getStore({
      name: blobStoreName,
      consistency: 'strong',
    });

    const bodyText = req.body ? await req.text() : '';

    await store.set(`${blobStoreName}-${randomUUID}`, bodyText);

    return new Response('CSP violation saved successfully');
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error saving CSP violations for ${appName}:`, error);

    throw new Error(
      `Error saving csp violations ${errorMessage} - ${
        error instanceof Error && 'status' in error ? error.status : 'unknown'
      }`,
    );
  }
}
