import { GetServerSideProps } from 'next';

import { getAccountSession } from 'lib/accountAuth/getAccountSession';
import { deleteSelfServeE2eFirm } from 'lib/ci/deleteSelfServeE2eFirm';

const Page = () => {
  return <>Blank page</>;
};

export default Page;

function readEmailQuery(
  query: string | string[] | undefined,
): string | undefined {
  if (typeof query === 'string') {
    return query.trim();
  }
  if (Array.isArray(query) && typeof query[0] === 'string') {
    return query[0].trim();
  }
  return undefined;
}

/**
 * CI cleanup for Playwright global teardown.
 * GET /ci/self-serve/cleanup-e2e-firm?email=e2e-user+…@test.com
 * Falls back to the authenticated session account email when query is omitted.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryEmail = readEmailQuery(context.query.email);
  const session = queryEmail ? null : await getAccountSession(context);
  const email = queryEmail ?? session?.accountEmail?.trim();

  if (!email) {
    context.res.statusCode = 400;
    context.res.setHeader('Content-Type', 'application/json');
    context.res.end(
      JSON.stringify({ success: false, error: 'Missing account email' }),
    );
    return { props: {} };
  }

  const result = await deleteSelfServeE2eFirm(email);
  context.res.statusCode = result.success ? 200 : 400;
  context.res.setHeader('Content-Type', 'application/json');
  context.res.end(JSON.stringify(result));
  return { props: {} };
};
