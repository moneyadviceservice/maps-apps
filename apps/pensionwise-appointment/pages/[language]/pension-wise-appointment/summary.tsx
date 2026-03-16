import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';

import { twMerge } from 'tailwind-merge';
import { Details } from '@maps-digital/shared/ui';

import { Callout } from '@maps-react/common/components/Callout';
import { H1, H3, H4, Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ShowHide } from '@maps-react/common/components/ShowHide';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool/SocialShareTool';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { SummaryCardList } from '../../../components/SummaryCardList';
import { SummaryDownload } from '../../../components/SummaryDownload';
import { SummaryList } from '../../../components/SummaryList';
import {
  fetchShared,
  fetchSummary,
  SummaryPageModel,
  ToDoItem,
} from '../../../utils';
import {
  filterInterestList,
  filterToDoCards,
} from '../../../utils/summaryPageFilter';

type PensionOption = {
  title: string;
  items: ToDoItem[];
  testId: string;
};

type SummaryPageProps = {
  data: SummaryPageModel;
  nonce?: string;
};

const ENABLE_SHOW_HIDE_AT = 8;
const MAX_CARDS_TO_SHOW = 6;

const Page: NextPage<PensionWisePageProps & SummaryPageProps> = ({
  data,
  nonce,
  ...pageProps
}) => {
  const {
    route: { app, query },
  } = pageProps;
  const { z } = useTranslation();

  const { language, returning, print, ...newQuery } = query;

  const {
    welcomeBackTitle,
    welcomeBackText,
    title,
    introText,
    basicPlanningTitle,
    basicPlanningIntro,
    basicPlanningToDoCards,
    optionsTitle,
    optionsIntro,
    optionsIntroLinkText,
    optionalBasicPlanningToDoCards,
    retireLaterTitle,
    retireLaterToDoItems,
    guaranteedIncomeTitle,
    guaranteedIncomeToDoItems,
    flexibleIncomeTitle,
    flexibleIncomeToDoItems,
    lumpSumTitle,
    lumpSumToDoItems,
    potInOneGoTitle,
    potInOneGoToDoItems,
    printButtonText,
    mixingYourOptionsTitle,
    mixingYourOptionsToDoItems,
    saveTitle,
    saveButtonText,
  } = data;

  const toDoCards = filterToDoCards(
    query,
    basicPlanningToDoCards,
    optionalBasicPlanningToDoCards,
  );

  const interestList: PensionOption[] = filterInterestList(query, {
    retireLater: {
      title: retireLaterTitle,
      items: retireLaterToDoItems,
    },
    guaranteedIncome: {
      title: guaranteedIncomeTitle,
      items: guaranteedIncomeToDoItems,
    },
    flexibleIncome: {
      title: flexibleIncomeTitle,
      items: flexibleIncomeToDoItems,
    },
    lumpSum: {
      title: lumpSumTitle,
      items: lumpSumToDoItems,
    },
    potInOneGo: {
      title: potInOneGoTitle,
      items: potInOneGoToDoItems,
    },
    mixinOptions: {
      title: mixingYourOptionsTitle,
      items: mixingYourOptionsToDoItems,
    },
  });

  const showHideEnabled = toDoCards.length > ENABLE_SHOW_HIDE_AT;
  const urn = query.urn;

  const PENSION_SURVEY_IDS = {
    production: {
      en: 'informizely-embed-ujqnyilh',
      cy: 'informizely-embed-uljyrlhlk',
    },
    development: {
      en: 'informizely-embed-fjguluwfj',
      cy: 'informizely-embed-zjiieufr',
    },
  };
  return (
    <PensionwisePageLayout {...pageProps} nonce={nonce} useInformizely={true}>
      <H1 className="mt-10 mb-8" data-testid="section-title">
        {title}
      </H1>

      {returning && (
        <Callout className="px-10 mb-6" testId="returning">
          <p className="mb-4 text-xl font-bold">{welcomeBackTitle}</p>
          <RichTextAem className={twMerge('text-lg', urn && '[&_ul]:mb-0')}>
            {mapJsonRichText(welcomeBackText.json)}
          </RichTextAem>
          {urn && (
            <ListElement
              items={[
                z({
                  en: `Your pension Wise reference is ${urn}`,
                  cy: `Eich cyfeirnod Pension Wise ${urn}`,
                }),
              ]}
              variant="unordered"
              color="blue"
              className="pl-4 ml-2.5 marker:text-[12px] marker:pr-4 [&_li]:pl-1"
            />
          )}
        </Callout>
      )}

      {urn && !returning && (
        <Callout className="px-10 py-4 mb-6">
          <Paragraph className="mb-0">
            {z({
              en: 'Your Pension Wise reference is',
              cy: 'Eich cyfeirnod Pension Wise',
            })}
          </Paragraph>
          <Paragraph className="mb-0 text-4xl font-bold" data-testid="urn">
            {urn}
          </Paragraph>
          <Details title={z({ en: 'What is this?', cy: 'Beth yw hwn?' })}>
            <>
              <Paragraph className="mt-0">
                {z({
                  en: 'If you have any questions about your online appointment: ',
                  cy: 'Os oes gennych unrhyw gwestiynau am eich apwyntiad ar-lein:',
                })}
              </Paragraph>
              <ListElement
                className="ml-7 marker:text-[12px] marker:pr-4"
                items={[
                  z({
                    en: 'use our webchat and',
                    cy: 'defnyddiwch ein gwesgwrs a',
                  }),
                  z({
                    en: 'quote your Pension Wise reference number.',
                    cy: 'dyfynnwch eich rhif cyfeirnod Pension Wise.',
                  }),
                ]}
                variant="unordered"
                color="magenta"
              />
              <Paragraph className="mt-4">
                {z({
                  en: 'One of our pension specialists can help. You won’t need to share your Pension Wise reference number for any other reason.',
                  cy: "Gall un o'n harbenigwyr pensiynau helpu. Ni fydd angen i chi rannu eich cyfeirnod Pension Wise am unrhyw reswm arall.",
                })}
              </Paragraph>
            </>
          </Details>
        </Callout>
      )}

      <div className="text-lg">{mapJsonRichText(introText.json)}</div>

      {interestList.length > 0 && (
        <>
          <H3
            className="flex mt-16 mb-3 leading-10 align-middle"
            data-testid="options-title"
          >
            <Icon
              type={IconType.ARROW_CURVED}
              className="inline-block mr-2 text-magenta-500 shrink-0"
            />{' '}
            {optionsTitle}
          </H3>

          <div className="mb-10">
            {optionsIntro}
            <Link
              href={{
                pathname: `/${language}/${app}`,
                query: newQuery,
              }}
              data-testid="options-intro-link"
              asInlineText={true}
            >
              {optionsIntroLinkText}
            </Link>
            .
          </div>

          {interestList.map((list, i) => {
            return (
              <SummaryList
                key={`summary-list-${i}`}
                title={list.title}
                items={list.items}
                testId={list.testId}
              />
            );
          })}
        </>
      )}

      <H3 className="mb-1">
        {z({
          en: 'Additional information',
          cy: 'Mwy o wybodaeth',
        })}
      </H3>
      <Paragraph className="mb-4">
        {z({
          en: 'Download a summary of the information and pension options discussed in your Pension Wise appointment to print or keep.',
          cy: `Lawrlwythwch grynodeb o'r wybodaeth a'r opsiynau pensiwn a drafodwyd yn eich apwyntiad Pension Wise i'w argraffu neu gadw.`,
        })}
      </Paragraph>

      <div className="md:flex">
        <SummaryDownload query={query} />
      </div>

      <H3
        className="flex pt-10 mt-10 mb-3 leading-10 align-middle border-t-2 border-slate-400"
        data-testid="basic-planning-title"
      >
        <Icon
          type={IconType.ARROW_CURVED}
          className="inline-block mr-2 text-magenta-500 shrink-0"
        />{' '}
        {basicPlanningTitle}
      </H3>

      <div className="mb-10">{mapJsonRichText(basicPlanningIntro.json)}</div>

      <SummaryCardList
        data={
          showHideEnabled ? toDoCards.slice(0, MAX_CARDS_TO_SHOW) : toDoCards
        }
      />

      {showHideEnabled && (
        <div className="md:mt-6 xl:mt-10">
          <ShowHide>
            <SummaryCardList
              testId="extra-summary-card-list"
              data={toDoCards.slice(MAX_CARDS_TO_SHOW, toDoCards.length)}
            />
          </ShowHide>
        </div>
      )}
      <div className="py-8 mt-12 mb-8 border-t-4 border-b-4 border-blue-700">
        <H4
          color="text-blue-700 px-6 md:px-0 text-center md:text-left"
          data-testid="save-title"
        >
          {saveTitle}
        </H4>

        <div className="pt-8 flex flex-col gap-11 px-11 md:px-0 md:flex-row md:gap-5">
          <Link
            asButtonVariant="primary"
            className="ml-0 mt-6 md:mt-0 w-full md:w-auto !justify-center"
            href={{
              pathname: `/${language}/${process.env.appUrl}/get-next-steps`,
              query: newQuery,
            }}
            data-testid="save-and-return"
          >
            {saveButtonText}
          </Link>
          <Link
            data-testid="summary-print"
            asButtonVariant="secondary"
            href={{
              pathname: `/${language}/${process.env.appUrl}/print-summary`,
              query: { ...newQuery, print: 'true' },
            }}
            target="_blank"
            withIcon={false}
            className="w-full md:w-auto text-center"
          >
            {printButtonText}
          </Link>
        </div>
      </div>
      <UrgentCallout
        data-testid="webchat-banner"
        border="teal"
        variant="arrow"
        className="mt-12"
      >
        <div className="md:flex">
          <div>
            <Heading level="h3" className="mb-6 font-semibold">
              {z({
                en: 'Have questions about your appointment summary?',
                cy: 'Oes gennych chi gwestiynau am grynodeb eich apwyntiad?',
              })}
            </Heading>
            <Paragraph>
              {z({
                en: 'Chat with one of our pensions specialists now using the webchat.',
                cy: `Sgwrsiwch gydag un o'n harbenigwyr pensiynau nawr gan ddefnyddio'r gwe-sgwrs.`,
              })}
            </Paragraph>
            <Paragraph className="!mb-0">
              <strong>
                {z({
                  en: 'Available Monday to Friday, 9am to 5pm.',
                  cy: 'Ar gael o ddydd Llun i ddydd Gwener, 9am tan 5pm.',
                })}
              </strong>
            </Paragraph>
          </div>
          <div className="hidden md:block lg:hidden xl:block shrink-0">
            <Image
              src="/images/pension-wise-logo.svg"
              width="237"
              height="92"
              alt="Pension Wise Logo"
            />
          </div>
        </div>
      </UrgentCallout>

      <div>
        {/* Tool Feedback Widget */}
        <ToolFeedback overrideIzCr={true} surveyIds={PENSION_SURVEY_IDS} />
        <div className="mt-8">
          <hr className="border-slate-400" />
        </div>
      </div>
      <div className="flex flex-col justify-between mt-12 sm:flex-row">
        <SocialShareTool
          url={z({
            en: 'www.moneyhelper.org.uk/pension-wise-online',
            cy: 'https://www.moneyhelper.org.uk/pension-wise-ar-lein',
          })}
          title={z({ en: 'Share this tool', cy: 'Rhannwch yr offeryn hwn' })}
          subject={z({
            en: 'Get a free Pension Wise appointment',
            cy: 'Gwnewch apwyntiad Pension Wise am ddim ',
          })}
          emailBodyText={z({
            en: 'Learn how and when you can take money from your defined contribution pension with a free online appointment.',
            cy: 'Dysgwch sut a phryd y gallwch gymryd arian o’ch pensiwn cyfraniadau wedi’u diffinio drwy apwyntiad ar-lein am ddim.',
          })}
          xTitle={z({
            en: 'Pension Wise: Learn how and when you can take money from your defined contribution pension with a free online appointment.',
            cy: 'Pension Wise: Dysgwch sut a phryd y gallwch gymryd arian o’ch pensiwn cyfraniadau wedi’u diffinio drwy apwyntiad ar-lein am ddim.',
          })}
        />
      </div>
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { heroTitle, heroContent, ...data } = await fetchSummary(query);
  const sharedContent = await fetchShared(query);

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data,
      sharedContent,
      pageTitle: data.browserPageTitle,
      heroTitle,
      heroContent,
      route: {
        query,
        back: '/',
        app: process.env.appUrl,
      },
      nonce: req.headers['x-nonce'] as string,
    },
  };
};
