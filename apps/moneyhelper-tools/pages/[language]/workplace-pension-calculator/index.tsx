import { EmbedPageLayout, ToolPageLayout } from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-digital/shared/hooks';
import { GetServerSideProps } from 'next';
import WPCCLanding from './wpcc-landing';

type Props = {
  children: JSX.Element;
  isEmbed: boolean;
};

type LandingProps = {
  lang: string;
  isEmbed: boolean;
};

export const WorkplacePensionCalculator = ({ children, isEmbed }: Props) => {
  const { z } = useTranslation();

  const title = z({
    en: 'Workplace pension contribution calculator',
    cy: 'Cyfrifiannell cyfraniadau pensiwn gweithle',
  });

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={title}
      breadcrumbs={
        !isEmbed
          ? [
              {
                label: z({ en: 'Home', cy: 'Hafan' }),
                link: z({
                  en: 'https://www.moneyhelper.org.uk/en',
                  cy: 'https://www.moneyhelper.org.uk/cy',
                }),
              },
              {
                label: z({
                  en: 'Pensions & retirement',
                  cy: 'Pensiynau ac ymddeoliad',
                }),
                link: z({
                  en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement',
                  cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement',
                }),
              },
              {
                label: z({
                  en: 'Auto enrolment',
                  cy: 'Ymrestru awtomatig',
                }),
                link: z({
                  en: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/auto-enrolment',
                  cy: 'https://www.moneyhelper.org.uk/cy/pensions-and-retirement/auto-enrolment',
                }),
              },
            ]
          : undefined
      }
      noMargin={true}
    >
      {children}
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => (
  <WorkplacePensionCalculator isEmbed={isEmbed}>
    <WPCCLanding lang={lang} />
  </WorkplacePensionCalculator>
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
