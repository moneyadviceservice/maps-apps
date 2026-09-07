import { GetServerSideProps } from 'next';

import { getAccountSession } from 'lib/accountAuth/getAccountSession';
import { ensureSelfServeE2eFirm } from 'lib/ci/ensureSelfServeE2eFirm';
import {
  getE2eFirmUpdateObject,
  MockRequestTypes,
} from 'lib/ci/getE2eFirmUpdateObject';
import { setE2eFirmState } from 'lib/ci/setE2eFirmState';
import { seedInvalidTradingNameForSS } from 'lib/ci/ss-seed-invalid-trading-name';
import {
  parseReregistrationSeedMode,
  seedReregistrationForSS,
} from 'lib/ci/ss-seed-reregistration';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';

const LOGIN_REDIRECT = {
  redirect: { destination: '/account/login', permanent: false },
  props: {},
};

const ACCOUNT_REDIRECT = {
  redirect: { destination: '/account', permanent: false },
  props: {},
};

const TRADING_SEED_REASON: Partial<Record<MockRequestTypes, string>> = {
  [MockRequestTypes.SET_INVALID_TRADING_NAME_SELF_SERVE_STATE]:
    HIDDEN_DUE_TO_TRADING_NAME,
  [MockRequestTypes.SET_FCA_UNAUTHORISED_SELF_SERVE_STATE]: HIDDEN_DUE_TO_FCA,
};

const Page = () => <>Blank page</>;
export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getAccountSession(context);
  if (!session?.accountEmail) return LOGIN_REDIRECT;

  const ensured = await ensureSelfServeE2eFirm(session);
  if (!ensured.success) return LOGIN_REDIRECT;

  await session.save();

  const mockQuery = (context.query.accountMock ?? '') as MockRequestTypes;
  const updateObject = await getE2eFirmUpdateObject(mockQuery);

  if (updateObject.success) {
    const setSession = await setE2eFirmState(session, updateObject.data);
    if (!setSession.success) return LOGIN_REDIRECT;
  }

  const tradingHiddenReason = TRADING_SEED_REASON[mockQuery];

  if (tradingHiddenReason) {
    const seeded = await seedInvalidTradingNameForSS(
      session,
      tradingHiddenReason,
    );
    if (!seeded.success) return LOGIN_REDIRECT;
  }

  const seedMode = parseReregistrationSeedMode(context.query.mode);
  if (seedMode) {
    const seeded = await seedReregistrationForSS(session, seedMode);
    if (!seeded.success) return LOGIN_REDIRECT;
  }

  return ACCOUNT_REDIRECT;
};
