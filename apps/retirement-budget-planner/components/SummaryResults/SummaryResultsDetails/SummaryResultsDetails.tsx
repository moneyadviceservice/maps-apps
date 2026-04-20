import { useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useFormContext } from 'context/FormContextProvider';
import { useSessionId } from 'context/SessionContextProvider';
import { costDefaultFrequencies } from 'data/essentialOutgoingsData';
import { incomeDefaultFrequencies } from 'data/retirementIncomeData';
import {
  FREQUENCY_FACTOR_MAPPING,
  PAGES_NAMES,
  SUMMARY_PROPS,
} from 'lib/constants/pageConstants';
import { Partner } from 'lib/types/aboutYou';
import { RetirementBudgetPlannerPageProps } from 'lib/types/page.type';
import { calculateIncomeTax } from 'lib/util/summary/income-tax';
import {
  findDisplayBoostStatePension,
  getAllCostRelatedNextStepsFlags,
  getlifeExpectancyDetails,
  hasentitelementsToAdditionalBenefits,
  shouldDisplayAgeHeading,
} from 'lib/util/summary/next-steps';
import {
  getStatePensionAge,
  parsePensionAge,
} from 'lib/util/summary/state-pension-age';
import { sumFields } from 'lib/util/summaryCalculations/calculations';

import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ListElement } from '@maps-react/common/components/ListElement';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { SummaryBreakdownTotal } from '../SummaryBreakdownTotal';
import { SummaryResultsCalloutNotice } from '../SummaryResultsCalloutNotice';

type Props = {
  income: Record<string, string>;
  costs: Record<string, string>;
  divisor: string;
  tabName: string;
  partner: Partner;
} & Pick<RetirementBudgetPlannerPageProps, 'sessionId'>;

type Summary = {
  income: number;
  spending: number;
};

export const SummaryResultsDetails = ({
  income,
  costs,
  divisor,
  tabName,
  partner,
  sessionId,
}: Props) => {
  const { locale, t, tList } = useTranslation();
  const { dob, gender, retireAge } = partner;
  const statePensionAge = getStatePensionAge(dob);

  const router = useRouter();

  const {
    remainingLifeExpectancy,
    lifeExpectancyTitle,
    lifeExpectancyContent,
  } = getlifeExpectancyDetails(retireAge, gender, t);
  const { handleSaveAndComeBack } = useFormContext();
  const sessionIdFromContext = useSessionId();
  const mapFrequencyToValue = (val: string) =>
    FREQUENCY_FACTOR_MAPPING.find((t) => t.key === val)?.value;
  const summary: Summary = useMemo(() => {
    const factor = mapFrequencyToValue(divisor) ?? 1;
    return {
      [SUMMARY_PROPS.INCOME]:
        sumFields(income, incomeDefaultFrequencies, 'Frequency') / factor,
      [SUMMARY_PROPS.SPENDING]:
        sumFields(costs, costDefaultFrequencies(), 'Frequency') / factor,
    };
  }, [income, costs, divisor]);
  const annualIncomeAfterTax = calculateIncomeTax(income);
  const displayBoostStatePension = findDisplayBoostStatePension(
    income,
    statePensionAge,
    dob,
  );

  const entitelementsToAdditionalBenefits =
    hasentitelementsToAdditionalBenefits(income);
  const retireBeforeStatePensionAge =
    Number(retireAge) * 12 < parsePensionAge(statePensionAge);

  const [mortgageAmount, rentOrCareHomeAmount, unsecuredLoans] =
    getAllCostRelatedNextStepsFlags(costs);

  const [isLoading, setIsLoading] = useState(false);

  const handleClickStartAgain = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);

      const startAgainResponse = await fetch(`/api/start-again`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId ?? sessionIdFromContext ?? '',
          language: locale,
        }),
      });

      if (startAgainResponse.redirected && startAgainResponse.url) {
        router.push(startAgainResponse.url);
      } else {
        router.push(`/${locale}/${PAGES_NAMES.ABOUTYOU}`);
      }
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
    }
  };
  const displayHeadingWithAge = shouldDisplayAgeHeading(dob);
  const resultsHeading = displayHeadingWithAge
    ? t('summaryPage.heading', {
        age: statePensionAge,
        annualIncome: annualIncomeAfterTax.toLocaleString('en-GB', {
          style: 'currency',
          currency: 'GBP',
          maximumFractionDigits: 0,
        }),
      })
    : t('summaryPage.altHeading', {
        annualIncome: annualIncomeAfterTax.toLocaleString('en-GB', {
          style: 'currency',
          currency: 'GBP',
          maximumFractionDigits: 0,
        }),
      });
  return (
    <div className="space-y-8">
      {/* Heading overview */}
      <Heading
        component="h2"
        level="h3"
        fontWeight="font-normal"
        className="font-normal text-[30px] leading-[42px] md:text-[42px] md:leading-[56px]"
        data-testid="your-results-subheading"
      >
        <Markdown content={resultsHeading} disableParagraphs withIcon={false} />
      </Heading>

      {/* Tax rates disclaimer */}
      <Markdown
        content={t('summaryPage.disclaimer.taxRates')}
        className="text-2xl whitespace-pre-line"
        withIcon={false}
        testId="your-results-tax-rates-disclaimer"
      />

      {/* Already retired disclaimer */}
      <Markdown
        content={t('summaryPage.disclaimer.alreadyRetired')}
        className="text-base"
        withIcon={false}
        testId="your-results-already-retired-disclaimer"
      />

      {/* Income vs costs callout */}
      {summary.income >= summary.spending && (
        <SummaryResultsCalloutNotice
          title={t('summaryPage.incomeCallout.costsLowerThanIncome.title')}
          content={t('summaryPage.incomeCallout.costsLowerThanIncome.content')}
          variant="primary"
          titleTestId="summary-results-costs-lower-than-income-title"
        />
      )}
      {summary.spending > summary.income && (
        <SummaryResultsCalloutNotice
          title={t('summaryPage.incomeCallout.costsHigherThanIncome.title')}
          content={t('summaryPage.incomeCallout.costsHigherThanIncome.content')}
          variant="primary"
          titleTestId="summary-results-costs-higher-than-income-title"
        />
      )}

      {/* Chart and total estimate */}
      <SummaryBreakdownTotal
        income={income}
        costs={costs}
        divider={divisor}
        tabName={tabName}
      />

      {/* Extra callouts */}
      {remainingLifeExpectancy > 0 && (
        <div data-testid="life-expectancy-callout">
          <Heading
            level="h4"
            className="mb-8"
            data-testid="life-expectancy-title"
          >
            <Markdown content={lifeExpectancyTitle} disableParagraphs />
          </Heading>
          <Markdown
            content={lifeExpectancyContent}
            className="text-base"
            withIcon={false}
          />
        </div>
      )}
      {retireBeforeStatePensionAge && (
        <div data-testid="retire-before-state-pension-age-callout">
          <Heading
            level="h4"
            className="mb-8"
            data-testid="retire-before-state-pension-age-title"
          >
            {t('summaryPage.retirementCallout.statePensionAge.title')}
          </Heading>
          <Markdown
            content={t('summaryPage.retirementCallout.statePensionAge.content')}
            className="text-base"
          />
          <ListElement
            variant="unordered"
            color="dark"
            items={tList(
              'summaryPage.retirementCallout.statePensionAge.listItems',
            ).map((listItem: string) => listItem)}
            className="pl-8 mt-2 space-y-4 text-base"
          />
        </div>
      )}
      {gender === 'female' && (
        <SummaryResultsCalloutNotice
          title={t('summaryPage.nextStepsCallout.genderGap.title')}
          content={t('summaryPage.nextStepsCallout.genderGap.content')}
          variant="secondary"
          titleTestId="summary-results-gender-gap-title"
        />
      )}
      {!!displayBoostStatePension && (
        <SummaryResultsCalloutNotice
          title={t('summaryPage.nextStepsCallout.statePension.title')}
          content={t('summaryPage.nextStepsCallout.statePension.content')}
          variant="secondary"
          titleTestId="summary-results-state-pension-title"
        />
      )}
      {entitelementsToAdditionalBenefits && (
        <SummaryResultsCalloutNotice
          title={t('summaryPage.nextStepsCallout.benefits.title')}
          content={t('summaryPage.nextStepsCallout.benefits.content')}
          variant="secondary"
          titleTestId="summary-results-benefits-title"
        />
      )}
      {!!unsecuredLoans && (
        <SummaryResultsCalloutNotice
          title={t('summaryPage.nextStepsCallout.borrowing.title')}
          content={t('summaryPage.nextStepsCallout.borrowing.content')}
          variant="secondary"
          titleTestId="summary-results-borrowing-title"
        />
      )}
      {!!mortgageAmount && (
        <SummaryResultsCalloutNotice
          title={t('summaryPage.nextStepsCallout.mortgage.title')}
          content={t('summaryPage.nextStepsCallout.mortgage.content')}
          variant="secondary"
          titleTestId="summary-results-mortgage-title"
        />
      )}

      {!!rentOrCareHomeAmount && (
        <SummaryResultsCalloutNotice
          title={t('summaryPage.nextStepsCallout.socialHousing.title')}
          content={t('summaryPage.nextStepsCallout.socialHousing.content')}
          variant="secondary"
          titleTestId="summary-results-social-housing-title"
        />
      )}

      {/* Buttons */}
      <div className="flex flex-col justify-start gap-12 pt-8 md:flex-row">
        <Button
          variant="primary"
          formAction={`/api/submit?save=true`}
          onClick={handleSaveAndComeBack}
        >
          {t('summaryPage.cta.save')}
        </Button>
        <Button
          variant={isLoading ? 'loading' : 'secondary'}
          iconLeft={
            isLoading ? (
              <Icon className="animate-spin" type={IconType.SPINNER} />
            ) : undefined
          }
          formAction={`/api/start-again`}
          onClick={handleClickStartAgain}
        >
          {isLoading
            ? t('summaryPage.cta.loading')
            : t('summaryPage.cta.restart')}
        </Button>
      </div>
    </div>
  );
};
