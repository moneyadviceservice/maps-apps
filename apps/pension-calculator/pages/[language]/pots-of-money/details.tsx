import type { GetServerSideProps } from 'next';

import { PensionsForm } from 'components/pensions/PensionsForm';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { pensionsCopy } from 'data/pensions';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getPensionsFromSession } from 'lib/session/pensionsSession';
import { hasPensionErrors, validatePotDetails } from 'lib/validation/pensions';
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
const Page = ({ sessionId, language, data, errors }: Props) => {
  const { z } = useTranslation();
  const copy = pensionsCopy(z);
  return (
    <PensionCalculatorBase
      pageHeading={copy.detailsHeading}
      intro={copy.detailsIntro}
      hasError={hasPensionErrors(errors)}
      backHref={journeyPath(language, JOURNEY_PAGES.POTS_OF_MONEY, sessionId)}
      sectionLabel={journeyCopy(z).sectionProgress(JOURNEY_PAGES.POTS_OF_MONEY)}
    >
      <PensionsForm
        step="details"
        sessionId={sessionId}
        initialData={data}
        initialErrors={errors}
      />
    </PensionCalculatorBase>
  );
};
export default Page;
export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.POT_DETAILS);
  if ('redirect' in context) return context;
  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.POTS_OF_MONEY,
    ...context,
  });
  if ('redirect' in access) return access;
  const data = ensurePensionsDefaults(
    await getPensionsFromSession(context.sessionId),
  );
  if (data.hasPotOfMoneyPension !== 'yes')
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
      errors: query.error === 'true' ? validatePotDetails(data) : {},
    },
  };
};
