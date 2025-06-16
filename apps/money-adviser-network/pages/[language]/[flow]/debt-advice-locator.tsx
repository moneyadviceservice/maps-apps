import { LastPageWrapper } from 'components/LastPageWrapper';
import { MANAnalytics } from 'data/analytics/analytics';
import { FLOW } from 'utils/getQuestions';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const DebtAdviceLocator = ({
  links,
  currentFlow,
  userId,
  lang,
  storedData,
}: BaseProps) => {
  const { z } = useTranslation();

  const referEnglandOnly = currentFlow === FLOW.START;

  const backLink = referEnglandOnly
    ? links.question.goToQuestionTwo
    : links.question.backLink;

  const heading = z({
    en: 'Refer the customer to the debt advice locator',
    cy: 'Atgyfeiro y cwsmer at y lleolwr cyngor ar ddyledion',
  });

  const copyLink = z({
    en: 'https://www.moneyhelper.org.uk/en/money-troubles/dealing-with-debt/debt-advice-locator',
    cy: 'https://www.moneyhelper.org.uk/cy/money-troubles/dealing-with-debt/debt-advice-locator',
  });

  const stepData = {
    pageName: `debt-advice-locator`,
    pageTitle: heading,
    stepName: 'Refer the customer to the debt advice locator',
  };

  return (
    <MoneyAdviserNetwork step="debtAdviceLocator">
      <Analytics
        analyticsData={MANAnalytics(z, 3.1, stepData, currentFlow, userId)}
        currentStep={3.1}
        formData={storedData}
      >
        <LastPageWrapper
          heading={heading}
          lang={lang}
          backLink={backLink}
          copyText={copyLink}
        >
          <>
            <Paragraph className="text-[18px] mt-8">
              {referEnglandOnly
                ? z({
                    en: 'The Money Adviser Network helps people living in England only. ',
                    cy: "Mae'r Rhwydwaith Cynghorwyr Arian yn helpu pobl sy'n byw yn Lloegr yn unig.",
                  })
                : z({
                    en: 'The Money Adviser Network is a telephone and online debt service only.',
                    cy: "Mae'r Rhwydwaith Cynghorwyr Ariannol yn wasanaeth dyled ffôn ac ar-lein yn unig.",
                  })}
            </Paragraph>
            <Paragraph className="text-[18px]">
              {referEnglandOnly
                ? z({
                    en: 'Ask the customer to use the debt advice locator tool:',
                    cy: "Gofynnwch i'r cwsmer ddefnyddio'r teclyn lleolwr cyngor ar ddyledion:",
                  })
                : z({
                    en: 'If your customer would prefer to speak to someone face to face, please direct them to the debt advice locator tool.',
                    cy: 'Os oes gwell gan eich cwsmer siarad â rhwyun wyneb yn wyneb, cyfeiriwch nhw at y teclyn lleolwr cyngor ar ddyledion.',
                  })}
            </Paragraph>
            <Paragraph className="text-[18px]">
              <Link
                href={copyLink}
                target="_blank"
                asInlineText
                withIcon={false}
              >
                {copyLink} (
                {z({
                  en: 'opens in a new tab',
                  cy: 'yn agor mewn tab newydd',
                })}
                )
              </Link>
            </Paragraph>
          </>
        </LastPageWrapper>
      </Analytics>
    </MoneyAdviserNetwork>
  );
};

export default DebtAdviceLocator;

export const getServerSideProps = getServerSidePropsDefault;
