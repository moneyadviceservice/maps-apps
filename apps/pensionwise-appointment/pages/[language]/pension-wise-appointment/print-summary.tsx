import { GetServerSideProps, NextPage } from 'next';

import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { H1, H3 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { PensionWisePageProps } from '@maps-react/pwd/layouts/PensionwisePageLayout';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { SummaryCardList } from '../../../components/SummaryCardList';
import {
  fetchShared,
  fetchSummary,
  PensionOption,
  SummaryPageModel,
} from '../../../utils';
import {
  filterInterestList,
  filterToDoCards,
} from '../../../utils/summaryPageFilter';
import { useEffect, useState } from 'react';

type SummaryPageProps = {
  data: SummaryPageModel;
};

const Page: NextPage<PensionWisePageProps & SummaryPageProps> = ({
  data,
  ...pageProps
}) => {
  const {
    route: { app, query },
  } = pageProps;
  const { z } = useTranslation();

  const { language, returning, print, ...newQuery } = query;

  if (typeof window !== 'undefined' && print) {
    window.onload = () => {
      window.print();
    };
  }

  const {
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
    mixingYourOptionsTitle,
    mixingYourOptionsToDoItems,
    printPageBanner,
    bannerTextNonjs,
  } = data;

  const [hasJSOn, setHasJSOn] = useState(false);

  useEffect(() => {
    setHasJSOn(true);
  });

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

  const toDoCardsSections = Math.ceil(toDoCards.length / 6);

  return (
    <div className="container mx-auto py-6 md:py-10">
      <Callout
        variant={CalloutVariant.INFORMATION}
        className="text-2xl font-bold flex gap-3 print:hidden"
        testId="callout-urn"
      >
        <Icon
          type={IconType.X_FILTER}
          className="w-6 h-6 text-gray-800 self-center"
        />
        <div className="self-center">
          {hasJSOn ? printPageBanner : bannerTextNonjs}
        </div>
      </Callout>
      <H1 className="mt-10 mb-8 " data-testid="section-title">
        {title}
      </H1>

      {query?.urn && (
        <div className="py-5">
          <Paragraph className="mb-0 font-bold">
            {z({
              en: 'Your Pension Wise reference is',
              cy: 'Eich cyfeirnod Pension Wise',
            })}
          </Paragraph>
          <Paragraph className="text-4xl font-bold mb-0" data-testid="urn">
            {query.urn}
          </Paragraph>
        </div>
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
              className="inline-block mr-2 text-pink-600 shrink-0"
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
              <div
                key={`summary-list-${i}`}
                className="flex gap-4 mb-10"
                data-testid="interest-list-section"
              >
                <div className="w-[24px]">
                  <Icon type={IconType.CHECKLIST} fill="#c82a87" />
                </div>
                <ul className="z-10">
                  {list.items.map((item, j) => {
                    return (
                      <li
                        key={`list-item-${i}-${j}`}
                        className="ml-4 list-disc"
                        data-testid={`list-item-${i}-${j}`}
                      >
                        {mapJsonRichText(item.text.json)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </>
      )}

      <H3
        className="flex pt-10 mt-10 mb-3 leading-10 align-middle border-t-2 border-slate-400 print:border-t-0"
        data-testid="basic-planning-title"
      >
        <Icon
          type={IconType.ARROW_CURVED}
          className="inline-block mr-2 text-pink-600 shrink-0"
        />{' '}
        {basicPlanningTitle}
      </H3>

      <div className="mb-10">{mapJsonRichText(basicPlanningIntro.json)}</div>
      {toDoCardsSections > 0 &&
        Array.from({ length: toDoCardsSections }, (_, i) => i + 1).map(
          (_, i) => {
            return (
              <div key={`todo-section-${i}`} className="mb-40">
                <SummaryCardList
                  data={toDoCards.slice(i * 6, (i + 1) * 6)}
                  testId="todo-cards-section"
                />
              </div>
            );
          },
        )}
    </div>
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
