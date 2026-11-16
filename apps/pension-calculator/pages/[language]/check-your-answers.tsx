import { GetServerSideProps } from 'next';

import { JOURNEY_PAGES } from 'data/journey';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { journeyPath } from 'utils/journeyPath';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  backHref: string;
};

const CheckYourAnswersPage = ({ backHref }: Props) => {
  const { z } = useTranslation();
  const heading = z({ en: 'Check your answers', cy: '' });

  return (
    <PensionCalculatorBase
      pageHeading={heading}
      backHref={backHref}
      intro={z({
        en: 'This page will be added in a later story.',
        cy: '',
      })}
    >
      <></>
    </PensionCalculatorBase>
  );
};

export default CheckYourAnswersPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(
    query,
    params,
    JOURNEY_PAGES.CHECK_YOUR_ANSWERS,
  );
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.CHECK_YOUR_ANSWERS,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  return {
    props: {
      backHref: journeyPath(
        context.language,
        JOURNEY_PAGES.RETIREMENT_INCOME,
        context.sessionId,
      ),
    },
  };
};
