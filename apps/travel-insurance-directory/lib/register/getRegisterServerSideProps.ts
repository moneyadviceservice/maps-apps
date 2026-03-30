import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { getIronSession, IronSessionData } from 'iron-session';
import { fetchFirm } from 'lib/firms/fetchFirm';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

export const getRegisterServerSideProps =
  (isScenario: boolean): GetServerSideProps =>
  async (context: GetServerSidePropsContext) => {
    const { req, res, query } = context;
    const session = await getIronSession<IronSessionData>(
      req,
      res,
      registerSessionOptions,
    );

    let initialValues = null;

    if (session.db_id) {
      const firmData = await fetchFirm(session.db_id);
      if (firmData.response) {
        initialValues = isScenario
          ? firmData.response?.medical_coverage?.specific_conditions
          : firmData.response;
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
