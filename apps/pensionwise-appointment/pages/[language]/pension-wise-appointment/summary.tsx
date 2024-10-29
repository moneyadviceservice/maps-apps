import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import {
  PensionwisePageLayout,
  PensionWisePageProps,
} from '@maps-react/pwd/layouts/PensionwisePageLayout';
import {
  mapJsonRichText,
  JsonRichText,
} from '@maps-react/vendor/utils/RenderRichText';
import { Heading, H3, H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ShowHide } from '@maps-react/common/components/ShowHide';
import { Callout } from '@maps-react/common/components/Callout';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { Link } from '@maps-react/common/components/Link';

import { SummaryCardList } from '../../../components/SummaryCardList';
import { SummaryList } from '../../../components/SummaryList';
import { SummaryDownload } from '../../../components/SummaryDownload';
import { fetchShared, fetchSummary, ToDoCard, ToDoItem } from '../../../utils';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type SummaryPageModel = {
  welcomeBackTitle: string;
  welcomeBackText: JsonRichText;
  heroTitle: string;
  heroContent: JsonRichText;
  title: string;
  interestedIn: string;
  introText: JsonRichText;
  optionsTitle: string;
  optionsIntro: string;
  optionsIntroLinkText: string;
  basicPlanningTitle: string;
  basicPlanningIntro: JsonRichText;
  basicPlanningToDoCards: ToDoCard[];
  optionalBasicPlanningToDoCards: ToDoCard[];
  retireLaterTitle: string;
  retireLaterToDoItems: ToDoItem[];
  guaranteedIncomeTitle: string;
  guaranteedIncomeToDoItems: ToDoItem[];
  flexibleIncomeTitle: string;
  flexibleIncomeToDoItems: ToDoItem[];
  lumpSumTitle: string;
  lumpSumToDoItems: ToDoItem[];
  potInOneGoTitle: string;
  potInOneGoToDoItems: ToDoItem[];
  mixingYourOptionsTitle: string;
  mixingYourOptionsToDoItems: ToDoItem[];
  saveTitle: string;
  saveText: JsonRichText;
  saveButtonText: string;
};

type PensionOption = {
  title: string;
  items: ToDoItem[];
  testId: string;
};

type SummaryPageProps = {
  data: SummaryPageModel;
};

const ENABLE_SHOW_HIDE_AT = 8;
const MAX_CARDS_TO_SHOW = 6;

const Page: NextPage<PensionWisePageProps & SummaryPageProps> = ({
  data,
  ...pageProps
}) => {
  const {
    route: { app, query },
  } = pageProps;
  const { z } = useTranslation();

  const { language, returning, ...newQuery } = query;

  const {
    welcomeBackTitle,
    welcomeBackText,
    title,
    interestedIn,
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
    mixingYourOptionsTitle,
    mixingYourOptionsToDoItems,
    saveTitle,
    saveText,
    saveButtonText,
  } = data;

  const toDoCards = [...basicPlanningToDoCards];

  const todos = {
    // Pension basics
    4: query.t1q1 === '2' || query.t1q1 === '3',
    5: query.t1q2 === '1' || query.t1q2 === '3',
    // Income and savings
    6: query.t2q1 === '2',
    7: query.t2q2 === '2',
    8: query.t2q3 === '1',
    9: query.t2q3 === '3',
    // Debts and repayments
    10: query.t3q1 === '1' || query.t3q1 === '3',
    // Your home
    11: query.t4q1 === '1',
    // Health and family
    12: query.t5q1 === '2',
    13: query.t5q2 === '2',
  };

  Object.entries(todos).forEach(([id, hasTodo]) => {
    if (hasTodo) {
      const foundItem = optionalBasicPlanningToDoCards.find(
        (item: ToDoItem) => item.id === id,
      );

      if (foundItem) {
        toDoCards.push(foundItem);
      }
    }
  });

  const interestList: PensionOption[] = [];
  query.t6q1 === '1' &&
    interestList.push({
      title: retireLaterTitle,
      items: retireLaterToDoItems,
      testId: 'retire-later-list',
    });
  query.t7q1 === '1' &&
    interestList.push({
      title: guaranteedIncomeTitle,
      items: guaranteedIncomeToDoItems,
      testId: 'guaranteed-income-list',
    });
  query.t8q1 === '1' &&
    interestList.push({
      title: flexibleIncomeTitle,
      items: flexibleIncomeToDoItems,
      testId: 'flexible-income-list',
    });
  query.t9q1 === '1' &&
    interestList.push({
      title: lumpSumTitle,
      items: lumpSumToDoItems,
      testId: 'lump-sum-list',
    });
  query.t10q1 === '1' &&
    interestList.push({
      title: potInOneGoTitle,
      items: potInOneGoToDoItems,
      testId: 'pot-in-one-go-list',
    });
  query.t11q1 === '1' &&
    interestList.push({
      title: mixingYourOptionsTitle,
      items: mixingYourOptionsToDoItems,
      testId: 'mix-options-list',
    });

  const showHideEnabled = toDoCards.length > ENABLE_SHOW_HIDE_AT;

  return (
    <PensionwisePageLayout {...pageProps}>
      <H1 className="mt-10 mb-8" data-testid="section-title">
        {title}
      </H1>

      {returning && (
        <Callout className="mb-6">
          <p className="text-xl mb-4 font-bold">{welcomeBackTitle}</p>
          <RichTextAem className="text-lg">
            {mapJsonRichText(welcomeBackText.json)}
          </RichTextAem>
        </Callout>
      )}

      {interestList.length > 0 && (
        <Paragraph className="text-lg" data-testid="interest-list">
          {interestedIn}:{' '}
          {interestList.map((item, i) => {
            return (
              <span key={i} className="font-bold">
                {i === 0 ? item.title : item.title.toLowerCase()}
                {i === interestList.length - 2 && (
                  <span className="font-normal">
                    {' '}
                    {z({
                      en: 'and',
                      cy: 'a',
                    })}{' '}
                  </span>
                )}
                {i < interestList.length - 2 && ', '}
              </span>
            );
          })}
          {'.'}
        </Paragraph>
      )}

      <div className="text-lg">{mapJsonRichText(introText.json)}</div>

      {interestList.length > 0 && (
        <>
          <H3
            className="flex align-middle mt-16 mb-3 leading-10"
            data-testid="options-title"
          >
            <Icon
              type={IconType.ARROW_CURVED}
              className="inline-block mr-2 shrink-0 text-pink-600"
            />{' '}
            {optionsTitle}
          </H3>

          <div className="mb-10">
            {optionsIntro}{' '}
            <Link
              href={{
                pathname: `/${language}/${app}`,
                query: newQuery,
              }}
              data-testid="options-intro-link"
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

      <SummaryDownload query={query} />

      <H3
        className="flex align-middle mt-10 mb-3 pt-10 border-t-2 border-slate-400 leading-10"
        data-testid="basic-planning-title"
      >
        <Icon
          type={IconType.ARROW_CURVED}
          className="inline-block mr-2 shrink-0 text-pink-600"
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

      <UrgentCallout
        data-testid="webchat-banner"
        border="teal"
        variant="arrow"
        className="mt-12"
      >
        <div className="md:flex">
          <div>
            <Heading level="h3" className="font-semibold mb-6">
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

      <div className="mt-12 mb-8 py-8 border-t-4 border-b-4 border-blue-800">
        <H3 className="mb-3" color="text-blue-800" data-testid="save-title">
          {saveTitle}
        </H3>

        <div className="mb-8">{mapJsonRichText(saveText.json)}</div>

        <Link
          asButtonVariant="primary"
          className="ml-0 mt-6 md:mt-0 w-full md:w-auto !justify-center"
          href={{
            pathname: `/${language}/${process.env.appUrl}/save`,
            query: newQuery,
          }}
          data-testid="save-and-return"
        >
          {saveButtonText}
        </Link>
      </div>
    </PensionwisePageLayout>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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
    },
  };
};
