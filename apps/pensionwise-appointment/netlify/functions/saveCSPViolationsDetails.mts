import { getStore } from '@netlify/blobs';
import type { Context } from '@netlify/functions';

export default async function saveCSPViolationDetails(
  req: Request,
  context: Context,
) {
  const randomUUID = Buffer.from(crypto.randomUUID()).toString('base64');
  const store = getStore({
    name: 'pwdCSPViolationsBLob',
    consistency: 'strong',
  });

  try {
    const bodyText = req.body ? await req.text() : '';

    await store.set(`pwdCSPViolationsBLob-${randomUUID}`, bodyText);
  } catch (e) {
    throw new Error(`Error saving csp violations ${e.message} - ${e.status}`);
  }
  return new Response('Submission saved');
}
