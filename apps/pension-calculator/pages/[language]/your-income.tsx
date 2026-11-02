import { GetServerSideProps } from 'next';

import { YourIncomeForm } from 'components/your-income/YourIncomeForm';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { yourIncomeCopy } from 'data/your-income';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getIncomeFromSession } from 'lib/session/incomeSession';
import {
  hasYourIncomeErrors,
  validateYourIncome,
} from 'lib/validation/yourIncome';
import type { YourIncomeData, YourIncomeErrors } from 'types/income';
import { journeyPath } from 'utils/journeyPath';
import { ensureYourIncomeDefaults } from 'utils/parseYourIncomeForm';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
  data: YourIncomeData;
  errors: YourIncomeErrors;
};

const YourIncomePage = ({ sessionId, language, data, errors }: Props) => {
  const { z } = useTranslation();
  const copy = yourIncomeCopy(z);
  const shared = journeyCopy(z);

  return (
    <PensionCalculatorBase
      pageHeading={copy.heading}
      hasError={hasYourIncomeErrors(errors)}
      backHref={journeyPath(language, JOURNEY_PAGES.ABOUT_YOU, sessionId)}
      sectionLabel={shared.sectionProgress(JOURNEY_PAGES.YOUR_INCOME)}
      intro={copy.intro}
    >
      <YourIncomeForm
        sessionId={sessionId}
        initialData={data}
        initialErrors={errors}
      />
    </PensionCalculatorBase>
  );
};

export default YourIncomePage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.YOUR_INCOME);
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.YOUR_INCOME,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  const { language, sessionId } = context;
  const stored = await getIncomeFromSession(sessionId);
  const data = ensureYourIncomeDefaults(stored);
  const errors =
    query.error === 'true' ? validateYourIncome(data, language) : {};

  return {
    props: {
      sessionId,
      language,
      data,
      errors,
    },
  };
};
