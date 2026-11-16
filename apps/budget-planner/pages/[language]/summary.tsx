import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { Dialog } from 'components/Dialog/Dialog';
import ResetCalculator from 'components/ResetCalculator/ResetCalculator';
import SummaryTotal from 'components/SummaryTotal/SummaryTotal';
import tabs, {
  API_ENDPOINT,
  otherToolsContent,
  recommendedReadingContent,
  resetDialogContent,
  select,
  summary as config,
} from 'data/budget-planner';
import { useBudgetPlannerData } from 'hooks/useBudgetPlannerData';
import calculateBreakdown from 'utils/calculateBreakdown';
import calculateSummary, {
  calculateOutcomeRange,
} from 'utils/calculateSummary';
import { getCanonicalUrl } from 'utils/getCanonicalUrl/';

import { Button } from '@maps-react/common/components/Button';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import NumberFormat from '@maps-react/common/components/NumberFormat';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { SummarySpendBreakdown } from '@maps-react/common/components/SummarySpendBreakdown';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer/TeaserCardContainer';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useLanguage from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import BudgetPlanner, { getServerSidePropsDefault, Props } from '.';

export default function Summary({
  data,
  isEmbedded,
  ...props
}: Readonly<Props>) {
  const { t, tList, locale } = useTranslation();

  const router = useRouter();
  const lang = useLanguage();
  const canonicalUrl = getCanonicalUrl(lang);
  const { budgetData, hydrated } = useBudgetPlannerData();
  data = Object.keys(budgetData).length > 0 ? budgetData : data;

  const [divisor, setDivisor] = useState(Number(data?.summary?.divisor) || 1);

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const breakdown = useMemo(
    () => tabs.reduce(calculateBreakdown(data, divisor, true), []),
    [data, divisor],
  );

  const summaryTab = tabs.filter((t) => t.name === 'summary').pop();
  const { addEvent } = useAnalytics();

  const handleDownloadTracking = () => {
    addEvent({
      event: 'downloadLinkClicked',
      eventInfo: {
        toolName: 'Budget Planner',
        toolStep: '8',
        stepName: 'Summary',
      },
      linkInfo: {
        linkName: 'Download spreadsheet',
        linkType: 'xlsx',
      },
    });
  };

  const summary = useMemo(
    () =>
      breakdown.reduce(calculateSummary, {
        income: 0,
        spending: 0,
      }),
    [breakdown],
  );

  const { income, spending } = summary;

  const severity = useMemo<'positive' | 'neutral' | 'negative'>(() => {
    return calculateOutcomeRange(summary);
  }, [summary]);

  const [isOpenForPrint, setIsOpenForPrint] = useState(false);
  const total = useMemo(() => income + spending, [income, spending]);
  const background = useMemo(() => {
    if (severity === 'positive') {
      return 'bg-green-700';
    }
    if (severity === 'negative') {
      return 'bg-red-600';
    }
    return 'bg-gray-400';
  }, [severity]);

  const adobeCompletionData = useMemo(
    () => ({
      event: `${
        !income || !spending ? 'toolCompletionNoInput' : 'toolCompletion'
      }`,
      page: {
        pageName: 'budget planner--summary',
        pageTitle: t('site.analytics.tab-page-title', {
          title: t('summary/title'),
        }),
        site: 'moneyhelper',
        pageType: 'tool page',
        categoryLevels: ['Everyday money', 'Budgeting'],
      },
      tool: {
        toolName: 'Budget Planner',
        toolCategory: '',
        toolStep: 8,
        stepName: 'Summary',
      },
    }),
    [t, income, spending],
  );

  function handleSelectChange({ target }: ChangeEvent<HTMLSelectElement>) {
    setDivisor(Number.parseFloat(target.value));
  }

  useEffect(() => {
    window.onbeforeprint = () => {
      setIsOpenForPrint(true);
    };
    if (isOpenForPrint) {
      print();
    }
    window.onafterprint = () => {
      setIsOpenForPrint(false);
    };
  }, [isOpenForPrint]);

  useEffect(() => {
    if (!hydrated) return;
    addEvent(adobeCompletionData);
  }, [hydrated, addEvent, adobeCompletionData, income, spending]);

  if (!income || !spending) {
    // @note: "Income" is on tab 0, and the rest are spending tabs so going with the first one (2).
    const nextTab = !income ? tabs[0] : tabs[1];
    return (
      <BudgetPlanner {...props} data={data} tabName="summary">
        <div className="col-span-12 lg:col-span-10">
          <NoSummaryAvailable>
            <Button
              formAction={`${API_ENDPOINT}/${nextTab.name}`}
              onClick={(e) => {
                if (isEmbedded) return;
                e.preventDefault();

                router.push({
                  pathname: `/${locale}/${nextTab.name}`,
                  query: {
                    ...router.query,
                    returning: false,
                    isEmbedded: isEmbedded ? 'true' : 'false',
                  },
                });
              }}
            >
              {t(`${nextTab.name}/title`)}
            </Button>
          </NoSummaryAvailable>
          <div className="flex-grow mt-20 mb-6 border-t border-slate-400"></div>
          <div className="flex flex-col justify-between pb-20 print:hidden t-social-sharing sm:flex-row">
            <SocialShareTool
              url={canonicalUrl}
              title={t('summary/share.title')}
              subject={t('summary/share.subject')}
              xTitle={t('summary/share.subject')}
            />
          </div>
        </div>
      </BudgetPlanner>
    );
  }

  const summaryItems = [
    {
      label: t('common.income'),
      value: (
        <NumberFormat
          prefix="£"
          renderText={(value) => <b>{value}</b>}
          value={Math.abs(income)}
        />
      ),
    },
    {
      label: t('common.spending'),
      value: (
        <NumberFormat
          prefix="£"
          renderText={(value) => <b>{value}</b>}
          value={Math.abs(spending)}
        />
      ),
    },
  ];

  const severityVariant = {
    positive: NotificationBoxVariant.POSITIVE,
    neutral: NotificationBoxVariant.INFORMATION,
    negative: NotificationBoxVariant.NEGATIVE,
  };

  const calloutVariant =
    severityVariant[severity] || NotificationBoxVariant.DEFAULT;

  const additionalClassName =
    severity === 'neutral' && NotificationBoxVariant.INFORMATION
      ? 'before:bg-gray-400'
      : '';

  return (
    <BudgetPlanner
      {...props}
      data={data}
      tabName="summary"
      sectionTestClassName="t-summary"
    >
      <div className="col-span-12 lg:col-span-10">
        <input type="hidden" name="storedData" value={JSON.stringify(data)} />
        <div className="max-w-full mb-4 space-y-6 t-summary-intro">
          <NotificationBox
            className={`px-8 pt-6 pb-10 md:px-10 ${additionalClassName}`}
            variant={calloutVariant}
          >
            <Paragraph color={config[severity].color} className="pb-4">
              {t(`summary/outcomes.${severity}.title`)}
            </Paragraph>
            <div className="text-gray-800">
              {tList(`summary/outcomes.${severity}.body`).map(
                (paragraph: string, index: number) => (
                  <p
                    key={paragraph}
                    className={
                      index > 0 && severity !== 'negative' ? 'mt-4' : undefined
                    }
                  >
                    {paragraph}
                  </p>
                ),
              )}
            </div>
          </NotificationBox>
        </div>
        <Heading
          level="h3"
          component="h2"
          className="my-6 md:my-8 text-blue-700 text-[28px] md:text-[44px] font-[700] leading-10"
        >
          {t('summary/breakdown-heading')}
        </Heading>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-7 md:col-span-8 print:p-2 print:border-none border border-slate-400 rounded-[4px] t-summary-breakdown">
            <SummarySpendBreakdown
              data={breakdown.reduce(
                (
                  carry: {
                    name: ReactNode;
                    value: number;
                    tabName: string;
                    percentage: number;
                    colour: string;
                    url: string;
                    hasTick?: boolean;
                    isEstimate?: boolean;
                  }[],
                  { value, ...rest },
                ) => {
                  if (
                    rest.name === 'income' ||
                    rest.name === 'summary' ||
                    rest.name === 'your-scenario'
                  )
                    return carry;

                  return [
                    ...carry,
                    {
                      ...rest,
                      name: t(`${rest.name}/title`),
                      value: Math.abs(value),
                      tabName: rest.name,
                      percentage: Math.round((value / spending) * 100),
                    },
                  ];
                },
                [],
              )}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onEdit={(e: any, name: string) => {
                e.preventDefault();
                router.push({
                  pathname: `/${locale}/${name}`,
                  query: { ...router.query },
                });
              }}
            >
              {' '}
            </SummarySpendBreakdown>
          </div>

          <div className="col-span-12 sm:col-span-5 md:col-span-4 t-summary-total">
            <SummaryTotal
              selectOptions={select.map(({ name, value }) => ({
                text: t(`common.frequencies.${name}`),
                value: String(value),
              }))}
              defaultValue={divisor}
              onSelectChange={handleSelectChange}
              items={summaryItems}
              summary={{
                value: (
                  <NumberFormat
                    prefix="£"
                    renderText={(value) => <b>{value}</b>}
                    value={Math.abs(total)}
                  />
                ),
                label: t(`common.total-labels.${severity}`),
                background,
              }}
              showHeading={true}
            />
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-10">
        <div className="flex flex-col gap-4 mt-4 print:hidden sm:flex-row">
          {summaryTab && (
            <Link
              asButtonVariant="primary"
              className="justify-center"
              analyticsClassName="tool-save"
              type="button"
              aria-label={t('summary/save-results')}
              href={{
                pathname: `/${locale}/save`,
                query: {
                  isEmbedded: isEmbedded,
                  tabName: 'summary',
                  save: true,
                  ckey: props.query.ckey,
                },
              }}
            >
              {t('summary/save-results')}
            </Link>
          )}

          <Button
            variant="secondary"
            formAction={`${API_ENDPOINT}/spreadsheet`}
            formTarget="_self"
            analyticsClassName="tool-download"
            className=""
            onMouseDown={handleDownloadTracking}
            onKeyDown={handleDownloadTracking}
          >
            {t('summary/download-spreadsheet')}
          </Button>
          <Button
            variant="secondary"
            onClick={(event) => {
              event.preventDefault();
              setDialogIsOpen(true);
            }}
            analyticsClassName="tool-reset"
            formAction={`${API_ENDPOINT}/reset-calculator`}
          >
            {t('summary/start-again')}
          </Button>
        </div>

        <Dialog
          accessibilityLabelClose={t('components.dialog.close')}
          accessibilityLabelReset={t('components.dialog.reset')}
          isOpen={dialogIsOpen}
          onCloseClick={(e: React.SyntheticEvent) => {
            const mouseEvent = e as React.MouseEvent<HTMLButtonElement>;
            mouseEvent.preventDefault();
            setDialogIsOpen(false);
          }}
        >
          <ResetCalculator
            confirmAction={resetDialogContent.confirmAction}
            cancelAction={resetDialogContent.cancelAction}
            onCancelClick={(e) => {
              e.preventDefault();
              router.push(`/${locale}/summary`);
              setDialogIsOpen(false);
            }}
          />
        </Dialog>

        <Heading
          level="h3"
          component="h2"
          className="my-6 md:my-8 text-blue-700 text-[28px] md:text-[44px] font-[700] leading-10"
        >
          {t(
            severity !== 'negative'
              ? 'summary/recommended-reading.heading'
              : 'summary/recommended-reading.next-steps-heading',
          )}
        </Heading>
        <div className="">
          {recommendedReadingContent.map(
            ({ name, tags }, index) =>
              tags.includes(severity) && (
                <div key={index}>
                  <ExpandableSection
                    testClassName="mb-[-1px]"
                    variant="mainLeftIcon"
                    title={t(`summary/recommended-reading.items.${name}.title`)}
                  >
                    <div className="mb-8 text-[#000B3B]">
                      <Markdown
                        content={t(
                          `summary/recommended-reading.items.${name}.text`,
                        )}
                        className="mb-0"
                        withIcon={false}
                      />
                    </div>
                  </ExpandableSection>
                </div>
              ),
          )}
        </div>

        <Heading
          level="h3"
          component="h2"
          className="my-6 md:my-8 text-blue-700 text-[28px] md:text-[44px] font-[700] leading-10"
        >
          {t('summary/other-tools.heading')}
        </Heading>
        <div className="flex flex-wrap justify-between gap-6 t-summary-next-steps">
          <TeaserCardContainer gridCols={2}>
            {otherToolsContent.map(
              ({ name, tags, image }) =>
                tags.includes(severity) && (
                  <TeaserCard
                    key={name}
                    title={t(`summary/other-tools.items.${name}.title`)}
                    href={t(`summary/other-tools.items.${name}.link`)}
                    image={image.src}
                    description={t(`summary/other-tools.items.${name}.text`)}
                    imageClassName="max-h-[220px] sm:h-[200px]"
                    headingLevel={'h3'}
                  />
                ),
            )}
          </TeaserCardContainer>
        </div>
        <ToolFeedback />
        <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
          <SocialShareTool
            url={canonicalUrl}
            title={t('summary/share.title')}
            subject={t('summary/share.subject')}
            xTitle={t('summary/share.subject')}
          />
        </div>
      </div>
    </BudgetPlanner>
  );
}

function NoSummaryAvailable({ children }: any) {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl space-y-6">
      <Heading level="h2">{t('summary/no-summary.heading')}</Heading>
      <p>{t('summary/no-summary.text')}</p>
      <p>{children}</p>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsDefault;
