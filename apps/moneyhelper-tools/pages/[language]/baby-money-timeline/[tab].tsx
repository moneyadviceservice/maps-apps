import { useMemo } from 'react';

import { BabyMoneyTimelineAnalytics } from 'components/Analytics/BabyMoneyTimeline';
import { ToolFeedback } from 'components/ToolFeedback';
import { babyMoneyTimelineData } from 'data/baby-money-timeline/content';
import { TabLayout } from 'layouts/TabLayout';
import { ParsedUrlQuery } from 'querystring';
import { twMerge } from 'tailwind-merge';
import {
  mapEventDates,
  TimelineDataResult,
} from 'utils/BabyMoneyTimeline/timeline';
import { createCalendarURL } from 'utils/BabyMoneyTimeline/timelineCalendar';
import { tabDataTransformer } from 'utils/TabToolUtils';

import { H3, H4 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { BabyMoneyTimeline, getServerSidePropsDefault } from './index';

export type BabyMoneyTabIndex = 1 | 2 | 3 | 4 | 5;

type Props = {
  lang: string;
  urlPath: string;
  isEmbed: boolean;
  currentTab: BabyMoneyTabIndex;
  queryData: ParsedUrlQuery;
  backLinkQuery: ParsedUrlQuery;
};

const Tab = ({
  lang,
  urlPath,
  isEmbed,
  currentTab,
  queryData,
  backLinkQuery,
}: Props) => {
  const { z } = useTranslation();

  const { tabs } = useMemo(() => babyMoneyTimelineData(z), [z]);
  const toolBaseUrl = `/${lang}${urlPath}`;
  const currentStep = currentTab - 1;
  const { content } = tabs[currentStep];
  const { tabLinks, tabContentHeadings } = useMemo(
    () => tabDataTransformer({}, tabs, toolBaseUrl, {}, isEmbed),
    [tabs, toolBaseUrl, isEmbed],
  );

  const result = mapEventDates(
    `${queryData['year']}-${queryData['month']}-${queryData['day']}`,
    currentTab,
    z,
  );

  const params = new URLSearchParams(
    backLinkQuery as Record<string, string>,
  ).toString();

  const step = currentStep === 0 ? '' : `${currentStep}`;

  const backURL = `${toolBaseUrl}${step}?${params}`;
  const continueURL = `${toolBaseUrl}${currentTab + 1}?${params}`;
  const currentStepIndex = (currentStep + 1) as BabyMoneyTabIndex;

  return (
    <BabyMoneyTimeline
      isEmbed={isEmbed}
      step={currentStepIndex as BabyMoneyTabIndex | 'landing'}
    >
      <BabyMoneyTimelineAnalytics currentStep={currentStepIndex}>
        <TabLayout
          tabLinks={tabLinks}
          currentTab={currentTab}
          tabHeadings={tabContentHeadings}
          tabContent={
            <>
              <Paragraph className="text-lg">{content}</Paragraph>
              <div>
                {result.map((item: TimelineDataResult, i: number) => {
                  const dateMatched =
                    i === 0 || item.date !== result[i - 1].date;
                  return (
                    <div key={item.title}>
                      {dateMatched ? (
                        <H3 className="pt-8 pb-10 text-2xl md:text-4xl">
                          {item.tab > 3
                            ? z({ en: 'Month', cy: 'Mis' })
                            : z({ en: 'Week', cy: 'Wythnos' })}{' '}
                          {item.offset} - {z({ en: 'Starting', cy: 'Dechrau' })}{' '}
                          {item.dateFormatted}
                        </H3>
                      ) : null}

                      <InformationCallout
                        className={twMerge(dateMatched ? '' : 'mt-6')}
                      >
                        <div
                          className={twMerge(
                            ['flex items-center p-6 align-middle md:p-8'],
                            item.content && 'pb-4 md:pb-4',
                          )}
                        >
                          <span className="flex justify-center items-center shrink-0 bg-pink-600 text-white rounded-full w-[50px] h-[50px]">
                            <Icon type={IconType.CHECKLIST} />
                          </span>
                          <H4 className="text-[22px] mb-0 ml-4">
                            {item.title}
                          </H4>
                        </div>
                        {item.content && (
                          <div className="p-6 pt-0 md:p-8 md:pt-0">
                            {item.content}
                          </div>
                        )}
                      </InformationCallout>
                    </div>
                  );
                })}
              </div>
              {currentStep < 5 && (
                <Link
                  asButtonVariant="primary"
                  className="text-lg md:px-4 mt-14 "
                  href={continueURL}
                >
                  {z({ en: 'Continue', cy: 'Parhau' })}
                </Link>
              )}
              <ToolFeedback
                id={z({
                  en: 'informizely-embed-fgddnriui',
                  cy: 'informizely-embed-ugeryrudd',
                })}
              />
            </>
          }
          tabNotice={<AddToCalendar queryData={queryData} />}
          toolBaseUrl={toolBaseUrl}
          backLink={{
            href: backURL,
            title: z({ en: 'Back', cy: 'Yn ôl' }),
          }}
        />
      </BabyMoneyTimelineAnalytics>
    </BabyMoneyTimeline>
  );
};

const AddToCalendar = ({ queryData }: { queryData: ParsedUrlQuery }) => {
  const { z, locale } = useTranslation();
  const calendarURL = createCalendarURL(queryData, locale, z);

  return (
    <div className="items-center justify-between py-6 mb-6 md:flex border-slate-400 border-y-1 md:mb-8">
      <Paragraph className="max-w-[510px] text-lg mb-6 md:mb-0">
        {z({
          en: 'You can download all the dates in your timeline and add them to your calendar.',
          cy: 'Gallwch lawrlwytho’r holl ddyddiadau ar eich llinell amser a’u hychwanegu at eich calendr.',
        })}
      </Paragraph>
      <Link
        suppressHydrationWarning
        href={{ pathname: calendarURL }}
        download={'baby-money-timeline.ics'}
        id={'addCalendar'}
        asButtonVariant="primary"
        target="_blank"
      >
        {z({ en: 'Add to calendar', cy: 'Ychwanegwch at y calendr' })}
      </Link>
    </div>
  );
};

export default Tab;

export const getServerSideProps = getServerSidePropsDefault;
