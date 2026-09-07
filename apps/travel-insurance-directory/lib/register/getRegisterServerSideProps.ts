import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { ensureRenewalDraftForRegisterFlow } from 'lib/account/ensureRenewalDraftForRegisterFlow';
import {
  getRegistrationAnswersSource,
  getRegistrationScenarioAnswers,
} from 'lib/account/registrationAnswersSource';
import { requireRegistrationAccess } from 'lib/register/registrationAccess';
import { resolveRegisterFirm } from 'lib/register/resolveRegisterFirm';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

export const getRegisterServerSideProps =
  (isScenario: boolean): GetServerSideProps =>
  async (context: GetServerSidePropsContext) => {
    const access = await requireRegistrationAccess(context, 'firm');
    if (!access.allowed) {
      return access.result;
    }

    const session = access.session;

    const { query } = context;

    let initialValues = null;

    if (session.db_id) {
      let firm = await resolveRegisterFirm(session);
      if (firm) {
        firm = await ensureRenewalDraftForRegisterFlow(firm, session);
        initialValues = isScenario
          ? getRegistrationScenarioAnswers(firm)
          : getRegistrationAnswersSource(firm);
      }
    }

    const errorCookie = getCookieAndCleanUp(context, 'form_error', true);

    return {
      props: {
        step: query.step,
        isChangeAnswer: query.change === 'true',
        initialValues: initialValues ?? null,
        initialErrors: errorCookie?.fields ?? null,
      },
    };
  };
