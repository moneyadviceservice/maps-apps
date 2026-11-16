import type { GetServerSideProps } from 'next';

import { PensionsForm } from 'components/pensions/PensionsForm/PensionsForm';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { pensionPotsCopy } from 'data/pension-pots-summary';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getPensionsFromSession } from 'lib/session/pensionsSession';
import { PotsOfMoneyData } from 'types/pensions/pensions';
import { journeyPath } from 'utils/journeyPath';
import { ensurePensionsDefaults } from 'utils/parsePensionsForm/parsePensionsForm';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
  data: PotsOfMoneyData;
};

const Page = ({ sessionId, language, data }: Props) => {
  const { z } = useTranslation();
  return (
    <PensionCalculatorBase
      pageHeading={pensionPotsCopy(z).heading}
      backHref={journeyPath(language, JOURNEY_PAGES.POT_DETAILS, sessionId)}
      sectionLabel={journeyCopy(z).sectionProgress(JOURNEY_PAGES.POTS_OF_MONEY)}
      maxContentWidth="max-w-[964px]"
    >
      <PensionsForm
        step="summary"
        flow="pots-of-money"
        sessionId={sessionId}
        initialData={data}
        submitButtonCopy={pensionPotsCopy(z).summarySubmitButton}
      />
    </PensionCalculatorBase>
  );
};
export default Page;
export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.POT_SUMMARY);
  if ('redirect' in context) return context;
  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.POT_SUMMARY,
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
    },
  };
};
