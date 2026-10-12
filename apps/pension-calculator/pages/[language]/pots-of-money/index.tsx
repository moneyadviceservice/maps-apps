import { GetServerSideProps } from 'next';

import { PensionsForm } from 'components/pensions/PensionsForm';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { pensionsCopy } from 'data/pensions';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getPensionsFromSession } from 'lib/session/pensionsSession';
import {
  hasPensionErrors,
  validatePotScreening,
} from 'lib/validation/pensions';
import type { PotsOfMoneyData, PotsOfMoneyErrors } from 'types/pensions';
import { journeyPath } from 'utils/journeyPath';
import { ensurePensionsDefaults } from 'utils/parsePensionsForm';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
  data: PotsOfMoneyData;
  errors: PotsOfMoneyErrors;
};

const PotsOfMoneyPage = ({ sessionId, language, data, errors }: Props) => {
  const { z } = useTranslation();

  return (
    <PensionCalculatorBase
      pageHeading={pensionsCopy(z).screeningHeading}
      hasError={hasPensionErrors(errors)}
      backHref={journeyPath(language, JOURNEY_PAGES.YOUR_INCOME, sessionId)}
      sectionLabel={journeyCopy(z).sectionProgress(JOURNEY_PAGES.POTS_OF_MONEY)}
    >
      <PensionsForm
        step="screening"
        sessionId={sessionId}
        initialData={data}
        initialErrors={errors}
      />
    </PensionCalculatorBase>
  );
};

export default PotsOfMoneyPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.POTS_OF_MONEY);
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.POTS_OF_MONEY,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  const stored = await getPensionsFromSession(context.sessionId);
  const data = ensurePensionsDefaults(stored);
  const errors = query.error === 'true' ? validatePotScreening(data) : {};
  return { props: { ...context, data, errors } };
};
