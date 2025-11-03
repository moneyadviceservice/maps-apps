import Image from 'next/image';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionArrangement } from '../../lib/types';
import {
  getRetirementDate,
  processBenefitIllustrations,
} from '../../lib/utils/data';
import { currencyAmount, getYearFromDate } from '../../lib/utils/ui';
type SummarySentenceProps = {
  data: PensionArrangement[];
};

export const SummarySentence = ({ data }: SummarySentenceProps) => {
  const { t, tList, locale } = useTranslation();
  const accordionItems = tList('components.summary-sentence.accordion-content');

  const statePension = data.find((pension) => pension.pensionType === 'SP');
  const statePensionDate = statePension
    ? getRetirementDate(statePension)
    : null;
  const statePensionYear = statePensionDate
    ? getYearFromDate(statePensionDate)
    : null;

  let monthlyTotal = 0;
  let annualTotal = 0;

  if (statePensionYear != null) {
    // calculate totals if there is a statePensionYear
    const totals = data.reduce(
      (acc, pension) => {
        const { payableDetails } = processBenefitIllustrations(
          pension.benefitIllustrations,
        );

        // If there are no payable details, no monthly amount or no annual amount disregard this illustration
        if (!payableDetails?.monthlyAmount || !payableDetails?.annualAmount) {
          return acc;
        }

        const payableYear = payableDetails.payableDate
          ? getYearFromDate(payableDetails.payableDate)
          : undefined;

        const lastPaymentYear = payableDetails.lastPaymentDate
          ? getYearFromDate(payableDetails.lastPaymentDate)
          : undefined;

        // Check if the pension is payable using the payableDate and lastPaymentDate
        const isPayable =
          payableYear != null &&
          payableYear <= statePensionYear &&
          (lastPaymentYear == null || lastPaymentYear >= statePensionYear);

        // If the pension is payable add it to the totals
        if (isPayable) {
          acc.monthlyTotal += payableDetails.monthlyAmount ?? 0;
          acc.annualTotal += payableDetails.annualAmount ?? 0;
        }

        return acc;
      },
      { monthlyTotal: 0, annualTotal: 0 },
    );
    monthlyTotal = totals.monthlyTotal;
    annualTotal = totals.annualTotal;
  }

  return (
    <div
      data-testid="summary-sentence"
      className="grid-cols-12 mb-6 lg:mb-12 lg:grid"
    >
      <div className="lg:col-span-10 xl:col-span-8 2xl:col-span-7">
        <Heading
          data-testid="summary-title"
          level="h2"
          className="mb-8 md:mt-4 md:text-5xl lg:mb-12"
        >
          {t('components.summary-sentence.title')}
        </Heading>

        {statePensionYear ? (
          <>
            <div
              data-testid="summary-sentence-with-sp"
              className="p-4 pb-6 mb-6 bg-green-100 md:px-0 md:py-8 md:pb-2 rounded-bl-3xl"
            >
              <div className="md:grid md:grid-cols-8 md:gap-4">
                <div className="text-[26px] md:pl-8 md:col-span-5 mb-2 md:mb-8">
                  <Markdown
                    content={t(
                      'components.summary-sentence.state-pension-age',
                      {
                        tooltip: t('tooltips.state-pension-age'),
                        statePensionYear,
                      },
                    )}
                    className="leading-[1.6]"
                    testId="summary-sentence-state-pension-age"
                  />

                  <Paragraph
                    testId="summary-sentence-monthly"
                    className="text-3xl leading-[1.6] font-bold text-teal-700 sm:text-5xl"
                  >
                    {currencyAmount(monthlyTotal)} {t('common.a-month')}
                  </Paragraph>

                  <Markdown
                    content={t('components.summary-sentence.annually', {
                      annualTotal: `${currencyAmount(annualTotal)}`,
                    })}
                    className="mb-0 leading-[1.5]"
                    testId="summary-sentence-annual"
                  />
                </div>
                <div className="items-center md:flex sm:justify-end md:pr-6 md:col-span-3">
                  <Image
                    width={238}
                    height={212}
                    src={`/images/pensions-calculator.svg`}
                    data-testid="pension-image"
                    alt=""
                    className="w-[120px] h-[107px] md:w-auto md:h-auto md:max-w-[238px] md:max-h-[212px] ml-auto md:mb-4"
                  />
                </div>
              </div>
            </div>

            <Markdown
              content={t('components.summary-sentence.snapshot', {
                statePensionYear,
              })}
              className="mb-8 max-md:text-lg"
              testId="summary-sentence-snapshot"
            />
          </>
        ) : (
          <ToolIntro
            testId="summary-sentence-no-sp"
            className="mt-2 mb-6 text-lg lg:mb-8 max-lg:pt-2 xl:text-2xl"
          >
            <Markdown
              content={t('components.summary-sentence.no-state-pension-1')}
              className="mb-8 lg:mb-12"
            />
            <Paragraph>
              {t('components.summary-sentence.no-state-pension-2')}
            </Paragraph>
          </ToolIntro>
        )}

        <Link
          asButtonVariant="primary"
          href={`/${locale}/your-pensions-timeline`}
          className="leading-[1.5] items-start"
          data-testid="timeline-link"
        >
          <Icon
            type={IconType.TIMELINE}
            className="w-[15px] h-[15px] shrink-0 mt-2"
          />
          {t('components.summary-sentence.view-timeline')}
        </Link>

        {statePensionYear && (
          <ExpandableSection
            variant="hyperlink"
            title={t('components.summary-sentence.accordion-title')}
            contentTestClassName="leading-[1.6]"
            className="mt-5 lg:mt-7"
            testId="summary-accordion"
          >
            {accordionItems.map((item: string, index: number) => (
              <Markdown key={index} content={item} />
            ))}
          </ExpandableSection>
        )}
      </div>
    </div>
  );
};
