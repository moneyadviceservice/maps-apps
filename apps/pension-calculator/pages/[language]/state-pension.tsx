import { GetServerSideProps } from 'next';

import {
  StatePensionForm,
  StatePensionIntro,
} from 'components/state-pension/StatePensionForm';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { statePensionCopy } from 'data/state-pension';
import { useStatePensionForm } from 'hooks/useStatePensionForm';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getMaxWeeklyAmount } from 'lib/api/ev/stateBenefit';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getStatePensionFromSession } from 'lib/session/statePensionSession';
import { validateStatePension } from 'lib/validation/statePension';
import type { StatePensionErrors } from 'types/statePension';
import { defaultStatePensionData } from 'types/statePension';
import { journeyPath } from 'utils/journeyPath';

import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
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
  const form = useStatePensionForm({
    sessionId,
    initialWeeklyAmount: weeklyAmount,
    maxWeeklyAmount,
    initialErrors: errors,
  });

  return (
    <PensionCalculatorBase
      pageHeading={copy.heading}
      hasError={form.hasErrors}
      backHref={journeyPath(language, JOURNEY_PAGES.INCOME_PENSIONS, sessionId)}
      sectionLabel={journeyCopy(z).sectionProgress(JOURNEY_PAGES.STATE_PENSION)}
      intro={<StatePensionIntro maxWeeklyAmount={maxWeeklyAmount} />}
      pageErrors={
        form.hasErrors ? (
          <ErrorSummary
            ref={form.errorSummaryRef}
            title={form.copy.errorSummaryTitle}
            errors={form.errors}
            classNames="mb-2"
          />
        ) : null
      }
    >
      <StatePensionForm form={form} />
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
