import type { GetServerSideProps } from 'next';

import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getPensionsFromSession } from 'lib/session/pensionsSession';
import { hasPensionErrors, validatePotDetails } from 'lib/validation/pensions';
import { journeyPath } from 'utils/journeyPath';

import { Button } from '@maps-react/common/components/Button';
import { useTranslation } from '@maps-react/hooks/useTranslation';
type Props = { sessionId: string; language: string };
const Page = ({ sessionId, language }: Props) => {
  const { z } = useTranslation();
  return (
    <PensionCalculatorBase
      pageHeading={z({
        en: 'Pensions that build up a pot of money - Summary',
        cy: '',
      })}
      backHref={journeyPath(
        language,
        JOURNEY_PAGES.POT_CONTRIBUTIONS,
        sessionId,
      )}
      sectionLabel={journeyCopy(z).sectionProgress(JOURNEY_PAGES.POTS_OF_MONEY)}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <Button
          variant="primary"
          as="a"
          href={`/${language}/income-pensions?sessionId=${sessionId}`}
        >
          Confirm
        </Button>
      </div>
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
    page: JOURNEY_PAGES.POTS_OF_MONEY,
    ...context,
  });
  if ('redirect' in access) return access;
  const data = await getPensionsFromSession(context.sessionId);
  if (
    data?.hasPotOfMoneyPension !== 'yes' ||
    hasPensionErrors(validatePotDetails(data))
  )
    return {
      redirect: {
        destination: journeyPath(
          context.language,
          JOURNEY_PAGES.POT_CONTRIBUTIONS,
          context.sessionId,
        ),
        permanent: false,
      },
    };
  return { props: context };
};
