import { GetServerSideProps } from 'next';

import { JOURNEY_PAGES } from 'data/journey';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { journeyPath, withSessionId } from 'utils/journeyPath';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  backHref: string;
};

const SavePage = ({ backHref }: Props) => {
  const { z } = useTranslation();
  const heading = z({ en: 'Save and come back later', cy: '' });

  return (
    <PensionCalculatorBase
      pageHeading={heading}
      backHref={backHref}
      intro={z({
        en: 'This save journey will be added in a later story.',
        cy: '',
      })}
    >
      <></>
    </PensionCalculatorBase>
  );
};

export default SavePage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(query, params, JOURNEY_PAGES.SAVE);
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.SAVE,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  // Prefer explicit returnTo when present; otherwise back to about you.
  const returnTo =
    typeof query.returnTo === 'string' ? query.returnTo : undefined;
  const backHref = returnTo?.startsWith(`/${context.language}/`)
    ? withSessionId(returnTo, context.sessionId)
    : journeyPath(context.language, JOURNEY_PAGES.ABOUT_YOU, context.sessionId);

  return {
    props: {
      backHref,
    },
  };
};
