import { GetServerSideProps } from 'next';

import { BabyMoneyTimelineAnalytics } from 'components/Analytics/BabyMoneyTimeline';
import { pageData } from 'data/baby-money-timeline/landing';
import { stepData } from 'data/form-content/analytics/baby-money-timeline';
import { DataPath } from 'types';
import { filterQuery } from 'utils/filterQuery';
import { getToolPath } from 'utils/getToolPath';

import { Level } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { BabyMoneyTabIndex } from './[tab]';
import BabyMoneyTimelineLanding from './landing';

type Props = {
  children: JSX.Element;
  isEmbed: boolean;
  headingLevel?: Level;
  step: BabyMoneyTabIndex | 'landing';
};

type LandingProps = {
  lang: string;
  isEmbed: boolean;
  queryData: DataFromQuery;
};

export const BabyMoneyTimeline = ({
  children,
  isEmbed,
  headingLevel,
  step,
}: Props) => {
  const { z } = useTranslation();
  const page = pageData(z);

  const pageTitle = [
    z({ en: 'Baby money timeline:', cy: 'Llinell amser arian babi:' }),
    stepData[step](z).pageTitle,
    '-',
    z({ en: 'MoneyHelper Tools', cy: 'Teclynnau HelpwrArian' }),
  ].join(' ');

  return isEmbed ? (
    <EmbedPageLayout title={page.title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      headingClassName="lg:max-w-[946px]"
      title={page.title}
      pageTitle={pageTitle}
      breadcrumbs={undefined}
      titleTag={'span'}
      showContactUs={true}
      headingLevel={headingLevel ?? 'h1'}
    >
      {children}
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed, queryData }: LandingProps) => (
  <BabyMoneyTimeline isEmbed={isEmbed} step={'landing'}>
    <BabyMoneyTimelineAnalytics currentStep={'landing'}>
      <BabyMoneyTimelineLanding
        lang={lang}
        queryData={queryData}
        isEmbed={isEmbed}
      />
    </BabyMoneyTimelineAnalytics>
  </BabyMoneyTimeline>
);

export default Landing;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;

  return {
    props: {
      lang: lang,
      isEmbed: isEmbed,
      queryData: query,
    },
  };
};

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const urlPath = getToolPath(DataPath.BabyMoneyTimeline);
  const toolBaseUrl = `/${lang}${urlPath}`;
  const currentTab = Number(query?.tab);
  const backLinkQuery = filterQuery(query, ['language', 'tab']);

  return {
    props: {
      lang,
      isEmbed,
      queryData: query,
      toolBaseUrl,
      urlPath,
      currentTab,
      backLinkQuery,
    },
  };
};
