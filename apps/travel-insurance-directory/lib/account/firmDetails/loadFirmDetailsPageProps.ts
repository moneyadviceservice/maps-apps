import type { GetServerSidePropsContext } from 'next';

import { mergeFirmWithSelfServeEditDraft } from 'lib/account/selfServeEditDraft';
import { loadRequiredAccountFirmParams } from 'lib/account/tripCover/shared';
import type { FormErrorsState } from 'types/register';
import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { getCookieAndCleanUp } from 'utils/helper/getCookieAndCleanUp';

export type FirmDetailsPageProps = {
  firmId: string;
  initialValues: TravelInsuranceFirmDocument | null;
  initialErrors: FormErrorsState | null;
  isChangeAnswer: string | null;
};

export type FirmDetailsPageLoadResult =
  | { status: 'ok'; props: FirmDetailsPageProps }
  | {
      status: 'redirect';
      redirect: { destination: string; permanent: false };
    }
  | { status: 'notFound' };

export async function loadFirmDetailsPageProps(
  context: GetServerSidePropsContext,
): Promise<FirmDetailsPageLoadResult> {
  const load = await loadRequiredAccountFirmParams(context, {});

  if (load.status === 'redirect') {
    return { status: 'redirect', redirect: load.redirect };
  }

  if (load.status === 'notFound') {
    return { status: 'notFound' };
  }

  const { firmId, resolved } = load;
  const changeAnswer = context.query.change;
  const errorCookie = getCookieAndCleanUp(context, 'form_error', true);

  return {
    status: 'ok',
    props: {
      firmId,
      initialValues: mergeFirmWithSelfServeEditDraft(resolved.firm),
      initialErrors: errorCookie?.fields ?? null,
      isChangeAnswer: typeof changeAnswer === 'string' ? changeAnswer : null,
    },
  };
}
