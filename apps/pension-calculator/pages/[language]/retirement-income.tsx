import { GetServerSideProps } from 'next';

import { RetirementIncomeForm } from 'components/retirement-income/RetirementIncomeForm';
import {
  DEFAULT_FREQUENCY,
  type FrequencyValue,
  parseFrequency,
} from 'data/frequency';
import { JOURNEY_PAGES, journeyCopy } from 'data/journey';
import { retirementIncomeCopy } from 'data/retirement-income';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { getJourneyContext } from 'lib/getJourneyContext';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import { getIncomeFromSession } from 'lib/session/incomeSession';
import { firstString } from 'utils/formValue';
import { journeyPath } from 'utils/journeyPath';
import { targetRetirementIncome } from 'utils/targetRetirementIncome';

import { useTranslation } from '@maps-react/hooks/useTranslation';

type Props = {
  sessionId: string;
  language: string;
  annualTarget: number;
  initialFrequency: FrequencyValue;
};

const RetirementIncomePage = ({
  sessionId,
  language,
  annualTarget,
  initialFrequency,
}: Props) => {
  const { z } = useTranslation();
  const copy = retirementIncomeCopy(z);

  return (
    <PensionCalculatorBase
      pageHeading={copy.heading}
      backHref={journeyPath(language, JOURNEY_PAGES.STATE_PENSION, sessionId)}
      sectionLabel={journeyCopy(z).sectionProgress(
        JOURNEY_PAGES.RETIREMENT_INCOME,
      )}
      intro={copy.intro}
    >
      <RetirementIncomeForm
        sessionId={sessionId}
        language={language}
        annualTarget={annualTarget}
        initialFrequency={initialFrequency}
      />
    </PensionCalculatorBase>
  );
};

export default RetirementIncomePage;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  params,
}) => {
  const context = getJourneyContext(
    query,
    params,
    JOURNEY_PAGES.RETIREMENT_INCOME,
  );
  if ('redirect' in context) {
    return context;
  }

  const access = await requireJourneyAccess({
    page: JOURNEY_PAGES.RETIREMENT_INCOME,
    language: context.language,
    sessionId: context.sessionId,
  });
  if ('redirect' in access) {
    return access;
  }

  const income = await getIncomeFromSession(context.sessionId);
  const target = targetRetirementIncome(
    income?.grossPay ?? '',
    income?.grossPayFrequency ?? DEFAULT_FREQUENCY,
  );

  return {
    props: {
      sessionId: context.sessionId,
      language: context.language,
      annualTarget: target.annualTarget,
      initialFrequency: parseFrequency(firstString(query.frequency)),
    },
  };
};
