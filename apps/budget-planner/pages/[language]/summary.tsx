import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { Dialog } from 'components/Dialog/Dialog';
import ResetCalculator from 'components/ResetCalculator/ResetCalculator';
import SummaryTotal from 'components/SummaryTotal/SummaryTotal';
import { useBudgetPlannerProvider } from 'context/BudgetPlannerDataProvider';
import tabs, {
  API_ENDPOINT,
  otherToolsContent,
  recommendedReadingContent,
  resetDialogContent,
  select,
  shareToolContent,
  summary as config,
} from 'data/budget-planner';
import calculateBreakdown from 'utils/calculateBreakdown';
import calculateSummary, {
  calculateOutcomeRange,
} from 'utils/calculateSummary';
import { getCanonicalUrl } from 'utils/getCanonicalUrl/';

import { Button } from '@maps-react/common/components/Button';
import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
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

import BudgetPlanner, { getServerSidePropsDefault, Props } from '.';

export default function Summary({
  data,
  isEmbedded,
  ...props
}: Readonly<Props>) {
  const { z, locale } = useTranslation();

  const router = useRouter();
  const lang = useLanguage();
  const canonicalUrl = getCanonicalUrl(lang);
  const { dataInContext } = useBudgetPlannerProvider();
  data = Object.keys(dataInContext).length > 0 ? dataInContext : data;

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
  const summaryText = useMemo(() => {
    if (severity === 'positive') {
      return { en: 'Spare cash', cy: "Arian sy'n weddill" };
    }
    if (severity === 'negative') {
      return { en: 'Overspend', cy: 'Gorwariant' };
    }
    return { en: 'Balance', cy: 'Balans' };
  }, [severity]);
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
        pageTitle: z({
          en: `Budget planner: Summary - MoneyHelper Tools`,
          cy: `Cynlluniwr Cyllideb: Crynodeb - Teclynnau HelpwrArian`,
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
    [z, income, spending],
  );

  function handleSelectChange({ target }: ChangeEvent<HTMLSelectElement>) {
    setDivisor(parseFloat(target.value));
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
    addEvent(adobeCompletionData);
  }, [addEvent, adobeCompletionData, income, spending]);

  if (!income || !spending) {
    // @note: "Income" is on tab 0, and the rest are spending tabs so going with the first one (2).
    const nextTab = !income ? tabs[0] : tabs[1];
    return (
      <BudgetPlanner {...props} data={data} tabName="summary">
        <NoSummaryAvailable>
          <Button
            formAction={`${API_ENDPOINT}/${nextTab.name}`}
            onClick={(e) => {
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
            {z(nextTab.title)}
          </Button>
        </NoSummaryAvailable>
        <div className="flex-grow mt-20 mb-6 border-t border-slate-400"></div>
        <div className="flex flex-col justify-between pb-20 print:hidden t-social-sharing sm:flex-row">
          <SocialShareTool
            url={canonicalUrl}
            title={z(shareToolContent.title)}
            subject={z({
              en: 'Budget planner – Track your money with our simple tool',
              cy: 'Cynlluniwr cyllideb – Olrhain eich arian gyda’n teclyn syml',
            })}
            xTitle={z({
              en: 'Budget planner – Track your money with our simple tool',
              cy: 'Cynlluniwr cyllideb – Olrhain eich arian gyda’n teclyn syml',
            })}
          />
        </div>
      </BudgetPlanner>
    );
  }

  const summaryItems = [
    {
      label: z({ en: 'Income', cy: 'Incwm' }),
      value: (
        <NumberFormat
          prefix="£"
          renderText={(value) => <b>{value}</b>}
          value={Math.abs(income)}
        />
      ),
    },
    {
      label: z({ en: 'Spending', cy: 'Gwariant' }),
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
    positive: CalloutVariant.POSITIVE,
    neutral: CalloutVariant.INFORMATION,
    negative: CalloutVariant.NEGATIVE,
  };

  const calloutVariant = severityVariant[severity] || CalloutVariant.DEFAULT;

  const additionalClassName =
    severity === 'neutral' && CalloutVariant.INFORMATION
      ? 'before:bg-gray-400'
      : '';

  return (
    <BudgetPlanner
      {...props}
      data={data}
      tabName="summary"
      sectionTestClassName="t-summary"
    >
      <input type="hidden" name="storedData" value={JSON.stringify(data)} />
      <div className="max-w-full mb-4 space-y-6 t-summary-intro">
        <Callout
          className={`px-8 pt-6 pb-10 md:px-10 ${additionalClassName}`}
          variant={calloutVariant}
        >
          <Paragraph color={config[severity].color} className="pb-4">
            {z(config[severity].title)}
          </Paragraph>
          {config[severity].body && z(config[severity].body)}
        </Callout>
      </div>
      <Heading
        level="h3"
        component="h2"
        className="my-6 md:my-8 text-blue-700 text-[28px] md:text-[44px] font-[700] leading-10"
      >
        {z({
          en: 'Breakdown of your spending',
          cy: `Dadansoddiad o'ch gwariant`,
        })}
      </Heading>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="print:p-2 print:border-none sm:w-3/5 md:w-2/3 border border-slate-400 rounded-[4px] t-summary-breakdown">
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
                { title, value, ...rest },
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
                    name: z(title),
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
              router.push(`/${locale}/${name}`);
            }}
          >
            {' '}
          </SummarySpendBreakdown>
        </div>

        <div className="sm:w-2/5 md:w-1/3 t-summary-total">
          <SummaryTotal
            selectOptions={select.map(({ title, value }) => ({
              text: z(title),
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
              label: z(summaryText),
              background,
            }}
            showHeading={true}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4 print:hidden sm:flex-row">
        {summaryTab && (
          <Link
            asButtonVariant="primary"
            className="justify-center"
            analyticsClassName="tool-save"
            type="button"
            aria-label={z({
              en: 'Save results',
              cy: 'Arbed canlyniadau',
            })}
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
            {z({
              en: 'Save results',
              cy: 'Arbed canlyniadau',
            })}
          </Link>
        )}

        <Button
          variant="secondary"
          formAction={`${API_ENDPOINT}/spreadsheet`}
          formTarget="_blank"
          analyticsClassName="tool-download"
          className=""
          onMouseDown={handleDownloadTracking}
          onKeyDown={handleDownloadTracking}
        >
          {z({
            en: 'Download spreadsheet',
            cy: 'Lawrlwythwch y daenlen',
          })}
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
          {z({
            en: 'Start again',
            cy: 'Dechrau eto',
          })}
        </Button>
      </div>

      <Dialog
        accessibilityLabelClose="Close"
        accessibilityLabelReset="Reset"
        isOpen={dialogIsOpen}
        onCloseClick={(e: React.SyntheticEvent) => {
          const mouseEvent = e as React.MouseEvent<HTMLButtonElement>;
          mouseEvent.preventDefault();
          setDialogIsOpen(false);
        }}
      >
        <ResetCalculator
          title={resetDialogContent.title}
          description={resetDialogContent.description}
          confirmLabel={resetDialogContent.confirmButtonLabel}
          cancelLabel={resetDialogContent.cancelButtonLabel}
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
        {`${
          severity !== 'negative'
            ? z({
                en: 'Recommended reading',
                cy: `Darllen a argymhellir`,
              })
            : z({ en: 'Next steps', cy: 'Camau nesaf' })
        }`}
      </Heading>
      <div className="">
        {recommendedReadingContent.map(
          ({ title, text, tags }, index) =>
            tags.includes(severity) && (
              <div key={index}>
                <ExpandableSection
                  testClassName="mb-[-1px]"
                  variant="mainLeftIcon"
                  title={z(title)}
                >
                  <div className="mb-8 text-[#000B3B]">{z(text)}</div>
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
        {z({
          en: 'Other tools to try',
          cy: 'Teclynnau eraill i’w trio',
        })}
      </Heading>
      <div className="flex flex-wrap justify-between gap-6 t-summary-next-steps">
        <TeaserCardContainer gridCols={2}>
          {otherToolsContent.map(
            ({ title, text, tags, image, link }) =>
              tags.includes(severity) && (
                <TeaserCard
                  key={z(title)}
                  title={z(title)}
                  href={z(link)}
                  image={image.src}
                  description={z(text)}
                  imageClassName="max-h-[220px] sm:h-[200px]"
                  headingLevel={'h3'}
                />
              ),
          )}
        </TeaserCardContainer>
      </div>
      <div className="flex-grow mt-12 mb-6 border-t border-slate-400 print:hidden"></div>
      <ToolFeedback />
      <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
        <SocialShareTool
          url={canonicalUrl}
          title={z(shareToolContent.title)}
          subject={z({
            en: 'Budget planner – Track your money with our simple tool',
            cy: 'Cynlluniwr cyllideb – Olrhain eich arian gyda’n teclyn syml',
          })}
          xTitle={z({
            en: 'Budget planner – Track your money with our simple tool',
            cy: 'Cynlluniwr cyllideb – Olrhain eich arian gyda’n teclyn syml',
          })}
        />
      </div>
    </BudgetPlanner>
  );
}

function NoSummaryAvailable({ children }: any) {
  const { z } = useTranslation();
  return (
    <div className="max-w-xl space-y-6">
      <Heading level="h2">
        {z({
          en: "It looks like you haven't included any details of your spending habits",
          cy: 'Ymddengys nad ydych wedi cynnwys unrhyw fanylion am eich arferion gwario',
        })}
      </Heading>
      <p>
        {z({
          en: "It only takes a few minutes to add them in and then you'll get a breakdown of your budget and tailored guidance.",
          cy: "Gallwch eu hychwanegu yn gyflym iawn ac yna fe gewch grynodeb o'ch cyllideb ac arweiniad penodol i chi.",
        })}
      </p>
      <p>{children}</p>
    </div>
  );
}

export const getServerSideProps = getServerSidePropsDefault;
