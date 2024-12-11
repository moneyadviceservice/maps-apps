import PieChart from 'components/PieChart';
import { ResultsPageData } from 'data/mortgage-affordability/results';
import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
  OtherFieldKeys,
} from 'data/mortgage-affordability/step';
import { convertStringToNumber } from 'utils/convertStringToNumber';
import { formatCurrency } from 'utils/formatCurrency';
import {
  calculateMonthlyPayment,
  calculateRiskLevel,
  calculateRiskPercentage,
  calculateTotalFormValues,
} from 'utils/MortgageAffordabilityCalculator/calculateResultValues';
import { replacePlaceholder } from 'utils/replacePlaceholder';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type RiskLevel = 'success' | 'warning' | 'error';

type Props = {
  copy: ResultsPageData;
  borrowAmount: number;
  term: number;
  interestRate: number;
  formData: Record<string, string>;
  isSummary: boolean;
};

const pieColours = {
  warning: '#FFC200',
  error: '#D00000',
  success: '#008021',
};

export const ResultsCallout = ({
  copy,
  borrowAmount,
  term,
  interestRate,
  formData,
  isSummary,
}: Props) => {
  const incomeFields = [IncomeFieldKeys.TAKE_HOME];
  if (formData[OtherFieldKeys.SECOND_APPLICANT] === 'yes') {
    incomeFields.push(IncomeFieldKeys.SEC_TAKE_HOME);
  }

  const expenseFields = [
    ExpenseFieldKeys.CARD_AND_LOAN,
    ExpenseFieldKeys.CARE_SCHOOL,
    ExpenseFieldKeys.CHILD_SPOUSAL,
    ExpenseFieldKeys.TRAVEL,
    ExpenseFieldKeys.BILLS_INSURANCE,
  ];

  const monthlyPayment = calculateMonthlyPayment(
    borrowAmount,
    interestRate,
    term,
  );

  const riskPercentage = calculateRiskPercentage(
    expenseFields,
    incomeFields,
    monthlyPayment,
    formData,
  );

  const riskLevel = calculateRiskLevel(riskPercentage);
  const tcopy = copy.teaserInfo[riskLevel];

  const getVariant = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'success':
        return CalloutVariant.POSITIVE;
      case 'warning':
        return CalloutVariant.WARNING;
      case 'error':
        return CalloutVariant.NEGATIVE;
    }
  };

  const rent = convertStringToNumber(formData[ExpenseFieldKeys.RENT_MORTGAGE]);

  const getCalloutSummaryContent = () => {
    return (
      <>
        <Paragraph className="mb-4 mt-4">{tcopy.text}</Paragraph>
        <Paragraph className="mb-4">{tcopy.textNext}</Paragraph>
      </>
    );
  };

  const getInformationSummaryContent = () => {
    const fixedAndCommittedCosts = calculateTotalFormValues(
      expenseFields,
      formData,
    );
    const monthlyTakeHome = calculateTotalFormValues(incomeFields, formData);
    const essentialMonthlyCosts = fixedAndCommittedCosts + monthlyPayment;
    const percentagePayLeftOver = 100 - riskPercentage;
    const payLeftOverAfterCosts = monthlyTakeHome - essentialMonthlyCosts;

    const costsCopy = replacePlaceholder(
      'percentage',
      `${Math.round(riskPercentage)}`,
      tcopy.costsCopy,
    );

    const leftoverCopy = replacePlaceholder(
      'percentage',
      `${Math.round(percentagePayLeftOver)}`,
      tcopy.leftoverCopy,
    );

    const pieData = [
      {
        name: 'Pay left over',
        percentage: Math.round(percentagePayLeftOver),
        colour: '#D9D9D9',
      },
      {
        name: 'Monthly payments',
        percentage: Math.round(riskPercentage),
        colour: pieColours[riskLevel],
      },
    ];

    return (
      <div className="grid grid-cols-12 gap-4">
        <div className={'col-span-12 lg:col-span-3 lg:px-0'}>
          <PieChart items={pieData} displayPercentage={1} />
        </div>
        <div
          className={
            'col-span-12 lg:col-span-9 h-full flex flex-col justify-evenly'
          }
        >
          <div className="grid grid-cols-7 lg:grid-cols-5">
            <div className="col-span-1">
              <div className="flex justify-center flex-grow lg:mt-2">
                <span
                  className="print:hidden rounded-full h-[30px] w-[30px] mt-1 lg:mt-0 flex-none"
                  style={{ backgroundColor: pieData[1].colour }}
                ></span>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-6">
              <Paragraph>
                {replacePlaceholder(
                  'amount',
                  `${formatCurrency(essentialMonthlyCosts)}`,
                  costsCopy,
                )}
              </Paragraph>
            </div>
          </div>
          <div className="grid grid-cols-7 lg:grid-cols-5">
            <div className="col-span-1">
              <div className="flex justify-center flex-grow lg:mt-2">
                <span
                  className="print:hidden rounded-full h-[30px] w-[30px] mt-1 lg:mt-0 flex-none"
                  style={{ backgroundColor: pieData[0].colour }}
                ></span>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-6">
              <Paragraph>
                {replacePlaceholder(
                  'amount',
                  `${formatCurrency(payLeftOverAfterCosts)}`,
                  leftoverCopy,
                )}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <InformationCallout
      testClass="p-8"
      testId="ResultsCallout"
      aria-live="polite"
    >
      <Callout variant={getVariant(riskLevel)}>
        <Paragraph
          className="text-2xl font-bold"
          id={isSummary ? 'summary' : ''}
        >
          {tcopy.heading}
        </Paragraph>
        {isSummary ? (
          getCalloutSummaryContent()
        ) : (
          <Link href="#summary">{copy.teaserInfo.seeSummary}</Link>
        )}
      </Callout>
      {isSummary ? (
        getInformationSummaryContent()
      ) : (
        <>
          <Paragraph className="my-4">
            {copy.teaserInfo.estimatedPayments}
          </Paragraph>
          <Paragraph className="font-bold text-[32px] mb-4">
            {formatCurrency(monthlyPayment, 2)}
          </Paragraph>
          <hr className="border-gray-400" />
          <Paragraph className="my-4">
            {copy.teaserInfo.comparedWithRent}
          </Paragraph>
          <Paragraph className="font-bold text-[32px]">
            {formatCurrency(rent, 0)}
          </Paragraph>
        </>
      )}
    </InformationCallout>
  );
};
