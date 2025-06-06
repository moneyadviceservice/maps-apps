import { LastPageWrapper } from 'components/LastPageWrapper';
import { MANAnalytics } from 'data/analytics/analytics';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Analytics } from '@maps-react/core/components/Analytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BaseProps, getServerSidePropsDefault, MoneyAdviserNetwork } from '../';

const MoneyManagementRefer = ({
  links,
  lang,
  storedData,
  currentFlow,
  userId,
}: BaseProps) => {
  const { z } = useTranslation();
  const backLink = links.question.goToQuestionOne;
  const heading = z({
    en: 'Refer the customer to the following links',
    cy: 'Atgyfeirio y cwsmer at y dolenni canlynol',
  });

  const copyText = z({
    en: 'There is a helpful section on benefits: https://www.moneyhelper.org.uk/en/benefits\nThe "Money troubles" section has useful information to help with cost of living: https://www.moneyhelper.org.uk/en/money-troubles\nSearch for budget planner for a useful tool to help you create a budget: https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
    cy: 'Mae yna adran ddefnyddiol ar fudd-daliadau: https://www.moneyhelper.org.uk/cy/benefits\nMae gan yr adran "problemau ariannol" wybodaeth ddefnyddiol i helpu gyda chostau byw: https://www.moneyhelper.org.uk/cy/money-troubles\nChwilio am cynlluniwr cyllideb am declyn defnyddiol iawn a fydd yn eich helpu i greu cyllideb: https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner',
  });

  const stepData = {
    pageName: `money-management-refer`,
    pageTitle: heading,
    stepName: 'Refer the customer to the following links',
  };

  return (
    <MoneyAdviserNetwork step="refer">
      <Analytics
        analyticsData={MANAnalytics(z, 2.1, stepData, currentFlow, userId)}
        currentStep={3.1}
        formData={storedData}
      >
        <LastPageWrapper
          heading={heading}
          lang={lang}
          backLink={backLink}
          copyText={copyText}
        >
          <>
            <Paragraph className="font-bold">
              {z({
                en: 'Please inform the customer of the following:',
                cy: "Rhowch wybod i'r cwsmer am y canlynol:",
              })}
            </Paragraph>
            <Paragraph>
              {z({
                en: 'There is information on the MoneyHelper website that you might find helpful. It offers free and impartial guidance for dealing with money troubles:',
                cy: "Mae yna wybodaeth ar wefan HelpwrArian y gallai fod o gymorth i chi. Mae'n cynnig arweiniad diduedd ac am ddim ar gyfer delio â thrafferthion ariannol.",
              })}
            </Paragraph>
            <Paragraph>
              {z({
                en: 'Would you like me to send you more details via email or text or you can just visit MoneyHelper.org.uk?',
                cy: 'A hoffech i mi anfon mwy o fanylion atoch drwy e-bost neu neges destun neu gallwch ymweld â MoneyHelper.org.uk/cy?',
              })}
            </Paragraph>
            <Paragraph>
              {z({
                en: (
                  <>
                    There is a helpful section on benefits{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/en/benefits"
                      target="_blank"
                      asInlineText
                      withIcon={false}
                    >
                      https://www.moneyhelper.org.uk/en/benefits (opens in a new
                      tab)
                    </Link>
                  </>
                ),
                cy: (
                  <>
                    Mae yna adran ddefnyddiol ar fudd-daliadau{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/cy/benefits"
                      target="_blank"
                      asInlineText
                      withIcon={false}
                    >
                      https://www.moneyhelper.org.uk/cy/benefits (yn agor mewn
                      tab newydd)
                    </Link>
                  </>
                ),
              })}
            </Paragraph>
            <Paragraph>
              {z({
                en: (
                  <>
                    The &quot;Money troubles&quot; section has useful
                    information to help with cost of living{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/en/money-troubles"
                      target="_blank"
                      asInlineText
                      withIcon={false}
                    >
                      https://www.moneyhelper.org.uk/en/money-troubles (opens in
                      a new tab)
                    </Link>
                  </>
                ),
                cy: (
                  <>
                    Mae gan yr adran &quot;problemau ariannol&quot; wybodaeth
                    ddefnyddiol i helpu gyda chostau byw{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/cy/money-troubles"
                      target="_blank"
                      asInlineText
                      withIcon={false}
                    >
                      https://www.moneyhelper.org.uk/cy/money-troubles (yn agor
                      mewn tab newydd)
                    </Link>
                  </>
                ),
              })}
            </Paragraph>
            <Paragraph>
              {z({
                en: (
                  <>
                    Search for budget planner for a really useful tool that will
                    help you create a budget and see where your money is going{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner"
                      target="_blank"
                      asInlineText
                      withIcon={false}
                    >
                      https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner
                      (opens in a new tab)
                    </Link>
                  </>
                ),
                cy: (
                  <>
                    Chwilio am cynlluniwr cyllideb am declyn defnyddiol iawn a
                    fydd yn eich helpu i greu cyllideb a gweld ble mae&apos;ch
                    arian yn mynd{' '}
                    <Link
                      href="https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner"
                      target="_blank"
                      asInlineText
                      withIcon={false}
                    >
                      https://www.moneyhelper.org.uk/cy/everyday-money/budgeting/budget-planner
                      (yn agor mewn tab newydd)
                    </Link>
                  </>
                ),
              })}
            </Paragraph>
          </>
        </LastPageWrapper>
      </Analytics>
    </MoneyAdviserNetwork>
  );
};

export default MoneyManagementRefer;

export const getServerSideProps = getServerSidePropsDefault;
