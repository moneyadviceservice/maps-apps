import { GetServerSideProps } from 'next';

import { PensionsForm } from 'components/pensions/PensionsForm';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { incomePensionsCopy } from 'data/pensions';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getIncomePensionsFromSession } from 'lib/session/pensionsSession/pensionsSession';
import { hasPensionErrors } from 'lib/validation/pensions';
import { validateIncomeScreening } from 'lib/validation/pensions/pensions';
import type { DefinedIncomeData, DefinedIncomeErrors } from 'types/pensions';
import { journeyPath } from 'utils/journeyPath';
import { ensureIncomePensionsDefaults } from 'utils/parsePensionsForm/parsePensionsForm';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
  data: DefinedIncomeData;
  errors: DefinedIncomeErrors;
};

const DefinedIncomePage = ({ sessionId, language, data, errors }: Props) => {
  const { z } = useTranslation();

  return (
    <PensionCalculatorBase
      pageHeading={incomePensionsCopy(z).screeningHeading}
      hasError={hasPensionErrors(errors)}
      backHref={journeyPath(language, JOURNEY_PAGES.POTS_OF_MONEY, sessionId)}
      sectionLabel={journeyCopy(z).sectionProgress(
        JOURNEY_PAGES.INCOME_PENSIONS,
      )}
    >
      <PensionsForm
        step="screening"
        flow="income-pensions"
        sessionId={sessionId}
        initialData={data}
        initialErrors={errors}
      />
    </PensionCalculatorBase>
  );
};

export default DefinedIncomePage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(
    query,
    params,
    JOURNEY_PAGES.INCOME_PENSIONS,
  );
  if ('redirect' in context) return context;
  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.INCOME_PENSIONS,
    ...context,
  });
  if ('redirect' in access) return access;
  const data = ensureIncomePensionsDefaults(
    await getIncomePensionsFromSession(context.sessionId),
  );
  if (data.hasIncomePension !== 'yes')
    return {
      redirect: {
        destination: journeyPath(
          context.language,
          JOURNEY_PAGES.POTS_OF_MONEY,
          context.sessionId,
        ),
        permanent: false,
      },
    };
  return {
    props: {
      ...context,
      data,
      errors: query.error === 'true' ? validateIncomeScreening(data) : {},
    },
  };
};
