import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H3, Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { SummaryData, SummaryDataAmounts } from '../../lib/types';
import {
  currencyAmount,
  formatDate,
  getYearFromDate,
} from '../../lib/utils/ui';

type SummarySentenceProps = {
  data?: SummaryData;
  showTimeline?: boolean;
};

type SummaryGroup = {
  label: 'standard' | 'legacy' | 'alternative';
  data: SummaryDataAmounts;
};

const SpecificYearAccordion = ({
  isMobile,
  className,
}: {
  isMobile: boolean;
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <ExpandableSection
      variant="hyperlink"
      title={t('components.summary-sentence.specific-year-accordion-title')}
      contentTestClassName={twMerge('leading-[1.6]', isMobile && 'pt-1')}
      className={twMerge(
        isMobile
          ? 'mt-8 mb-6 md:hidden'
          : 'hidden md:block md:px-8 md:pb-12 md:col-span-8',
        className,
      )}
      testId={`specific-year-accordion-${isMobile ? 'mobile' : 'desktop'}`}
    >
      <Markdown
        content={t(
          'components.summary-sentence.specific-year-accordion-content',
        )}
      />
    </ExpandableSection>
  );
};

const McCloudAccordion = ({
  isMobile,
  className,
}: {
  isMobile: boolean;
  className?: string;
}) => {
  const { t, tList } = useTranslation();
  const accordionItemsMccloud = tList(
    'components.summary-sentence.mccloud-accordion-content',
  );
  return (
    <ExpandableSection
      variant="hyperlink"
      title={t('components.summary-sentence.mccloud-accordion-title')}
      contentTestClassName="leading-[1.6]"
      className={twMerge(
        isMobile
          ? 'md:hidden mb-6'
          : 'hidden md:block md:px-8 md:pb-4 md:col-span-8',
        className,
      )}
      testId={`mccloud-accordion-${isMobile ? 'mobile' : 'desktop'}`}
    >
      {accordionItemsMccloud.map((item: string, index: number) => (
        <Markdown key={index} content={item} />
      ))}
    </ExpandableSection>
  );
};

export const SummarySentence = ({
  data,
  showTimeline = true,
}: SummarySentenceProps) => {
  const { t, tList, locale } = useTranslation();

  const {
    statePensionDate,
    standardPayment,
    legacyPayment,
    alternativePayment,
    isMcCloudPensionPresent,
  } = data || {};

  const summaryArray: SummaryGroup[] = [
    ...(standardPayment
      ? [{ label: 'standard' as const, data: standardPayment }]
      : []),
    ...(legacyPayment && alternativePayment && !standardPayment
      ? [
          { label: 'legacy' as const, data: legacyPayment },
          { label: 'alternative' as const, data: alternativePayment },
        ]
      : []),
  ];

  // Default to English version of date in order to calculate state pension year correctly
  const formattedStatePensionDate = statePensionDate
    ? formatDate(statePensionDate, 'en')
    : null;

  const statePensionYear = formattedStatePensionDate
    ? getYearFromDate(formattedStatePensionDate)
    : null;

  const accordionItems = tList('components.summary-sentence.accordion-content');

  const hasMcCloudAmounts = summaryArray.some(
    (item) => item.label !== 'standard',
  );

  const timelineHref = `/${locale}/your-pensions-timeline${
    isMcCloudPensionPresent ? '?income=legacy' : ''
  }`;

  const timelineLink = (
    <Link
      asButtonVariant="primary"
      href={timelineHref}
      className="justify-center text-center leading-[1.5] items-start"
      data-testid="timeline-link"
    >
      <Icon
        type={IconType.TIMELINE}
        className="w-[15px] h-[15px] shrink-0 mt-1.5"
      />
      {t('components.summary-sentence.view-timeline')}
    </Link>
  );

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
              className="p-4 pb-6 mb-6 bg-teal-100 md:px-0 md:py-8 md:pb-0 rounded-bl-3xl"
            >
              <div className="md:grid md:grid-cols-8 md:gap-x-4">
                <div className="mb-2 md:pl-8 md:col-span-5 md:mb-8">
                  <Markdown
                    content={t(
                      'components.summary-sentence.state-pension-age',
                      {
                        statePensionYear,
                      },
                    )}
                    className="leading-[1.6] text-2xl"
                    testId="summary-sentence-state-pension-age"
                  />
                  {hasMcCloudAmounts && (
                    <H3
                      className="mt-4 font-semibold md:mt-10"
                      data-testid="summary-sentence-mccloud-title"
                    >
                      {t('components.summary-sentence.mccloud-title')}
                    </H3>
                  )}
                  {summaryArray.map((amounts, idx) => {
                    const { monthlyAmount, annualAmount } = amounts.data;
                    const isMcCloud = amounts.label !== 'standard';

                    return (
                      <div
                        className={twMerge(
                          isMcCloud &&
                            `border-l-4 pl-3 pb-1 md:pb-3 md:pl-5 mt-4 md:mt-10 border-teal-700`,
                          isMcCloud && idx === 1 && 'mt-6 md:mt-12',
                        )}
                        key={idx}
                      >
                        <Paragraph
                          className="mb-0 text-xl font-bold md:mb-2 md:text-2xl"
                          testId={`summary-sentence-label-${amounts.label}`}
                        >
                          {isMcCloud &&
                            t(`components.income-timeline.${amounts.label}`) +
                              ' ' +
                              t('components.income-timeline.option')}
                        </Paragraph>
                        <Paragraph
                          testId={`summary-sentence-monthly-${amounts.label}`}
                          className="mb-4 text-3xl font-bold text-teal-700 md:text-5xl"
                        >
                          {currencyAmount(monthlyAmount)} {t('common.a-month')}
                        </Paragraph>

                        <Markdown
                          content={t('components.summary-sentence.annually', {
                            annualTotal: `${currencyAmount(annualAmount)}`,
                          })}
                          className="mb-0 leading-[1.5] text-lg md:text-2xl"
                          testId={`summary-sentence-annual-${amounts.label}`}
                        />
                      </div>
                    );
                  })}

                  {showTimeline && (
                    <div className="mt-8 md:mt-8">{timelineLink}</div>
                  )}
                  <SpecificYearAccordion isMobile={true} />
                </div>
                {hasMcCloudAmounts && <McCloudAccordion isMobile={true} />}
                <div className="items-start md:flex sm:justify-end md:pr-6 md:col-span-3">
                  <Image
                    width={288}
                    height={169}
                    src={`/images/summary-illustration.svg`}
                    data-testid="pension-image"
                    alt=""
                    className="mx-auto mt-8 md:mb-4 md:mt-6"
                  />
                </div>
                <SpecificYearAccordion
                  isMobile={false}
                  className={hasMcCloudAmounts ? 'md:pb-1' : undefined}
                />
                {hasMcCloudAmounts && <McCloudAccordion isMobile={false} />}
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
          <>
            <ToolIntro
              testId="summary-sentence-no-sp"
              className="mt-2 mb-6 text-lg lg:mb-8 max-lg:pt-2 xl:text-2xl"
            >
              <Markdown
                content={t('components.summary-sentence.no-state-pension-1')}
                className={twMerge(showTimeline && 'mb-8 lg:mb-12')}
              />
              {showTimeline && (
                <Paragraph testId="summary-sentence-no-sp-2">
                  {t('components.summary-sentence.no-state-pension-2')}
                </Paragraph>
              )}
            </ToolIntro>

            {showTimeline && timelineLink}
          </>
        )}

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
