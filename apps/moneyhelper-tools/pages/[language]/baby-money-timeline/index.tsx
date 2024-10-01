import { GetServerSideProps } from 'next';
import { pageData } from 'data/baby-money-timeline/landing';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Level } from '@maps-digital/shared/ui';
import BabyMoneyTimelineLanding from './landing';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getToolPath } from 'utils/getToolPath';
import { DataPath } from 'types';

type Props = {
  children: JSX.Element;
  isEmbed: boolean;
  headingLevel?: Level;
};

type LandingProps = {
  lang: string;
  isEmbed: boolean;
};

export const BabyMoneyTimeline = ({
  children,
  isEmbed,
  headingLevel,
}: Props) => {
  const { z } = useTranslation();
  const page = pageData(z);

  return isEmbed ? (
    <EmbedPageLayout title={page.title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      headingClassName="lg:max-w-[960px]"
      title={page.title}
      breadcrumbs={undefined}
      titleTag={'span'}
      showContactUs={true}
      headingLevel={headingLevel ?? 'h1'}
    >
      {children}
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => (
  <BabyMoneyTimeline isEmbed={isEmbed}>
    <BabyMoneyTimelineLanding lang={lang} isEmbed={isEmbed} />
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

  return {
    props: {
      lang,
      isEmbed,
      queryData: query,
      toolBaseUrl,
      urlPath,
      currentTab,
    },
  };
};
