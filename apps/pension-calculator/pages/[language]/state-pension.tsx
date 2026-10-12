import { GetServerSideProps } from 'next';

import {
  StatePensionForm,
  StatePensionIntro,
} from 'components/state-pension/StatePensionForm';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { statePensionCopy } from 'data/state-pension';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getMaxWeeklyAmount } from 'lib/api/ev/stateBenefit';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getStatePensionFromSession } from 'lib/session/statePensionSession';
import {
  hasStatePensionErrors,
  validateStatePension,
} from 'lib/validation/statePension';
import type { StatePensionErrors } from 'types/statePension';
import { defaultStatePensionData } from 'types/statePension';
import { journeyPath } from 'utils/journeyPath';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
  weeklyAmount: string;
  maxWeeklyAmount: string;
  errors: StatePensionErrors;
};

const StatePensionPage = ({
  sessionId,
  language,
  weeklyAmount,
  maxWeeklyAmount,
  errors,
}: Props) => {
  const { z } = useTranslation();
  const copy = statePensionCopy(z, maxWeeklyAmount);

  return (
    <PensionCalculatorBase
      pageHeading={copy.heading}
      hasError={hasStatePensionErrors(errors)}
      backHref={journeyPath(language, JOURNEY_PAGES.POTS_OF_MONEY, sessionId)}
      sectionLabel={journeyCopy(z).sectionProgress(JOURNEY_PAGES.STATE_PENSION)}
      intro={<StatePensionIntro maxWeeklyAmount={maxWeeklyAmount} />}
    >
      <StatePensionForm
        sessionId={sessionId}
        initialWeeklyAmount={weeklyAmount}
        maxWeeklyAmount={maxWeeklyAmount}
        initialErrors={errors}
      />
    </PensionCalculatorBase>
  );
};

export default StatePensionPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.STATE_PENSION);
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.STATE_PENSION,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  const { language, sessionId } = context;
  const [stored, maxWeeklyAmount] = await Promise.all([
    getStatePensionFromSession(sessionId),
    getMaxWeeklyAmount(),
  ]);
  const data = stored ?? defaultStatePensionData();
  const errors =
    query.error === 'true'
      ? validateStatePension(data, maxWeeklyAmount, language)
      : {};

  return {
    props: {
      sessionId,
      language,
      weeklyAmount: data.weeklyAmount,
      maxWeeklyAmount,
      errors,
    },
  };
};
