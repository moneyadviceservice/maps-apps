import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

import { stepData } from 'data/form-content/analytics/pension-type';
import { landingText } from 'data/pension-type';
import { PensionTypeBottomContent } from 'layouts/PensionTypeBottomContent';
import { DataPath } from 'types';
import { getToolPath } from 'utils/getToolPath';

import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getToolLinks } from '@maps-react/utils/getToolLinks';
import { pageFilter } from '@maps-react/utils/pageFilter';

import LandingPage from './landing';

export type PensionTypeStringSteps = 'error' | 'landing';
export type PensionTypeNumberSteps = 1 | 2 | 3 | 4 | 5 | 6;
export type PensionTypeSteps = PensionTypeStringSteps | PensionTypeNumberSteps;
type Props = {
  children: JSX.Element;
  step: PensionTypeSteps;
  isEmbed: boolean;
  bottomContainerStyle?: string;
  isResultsPage?: boolean;
};
type LandingProps = {
  lang: string;
  isEmbed: boolean;
};

export const PensionType = ({
  children,
  step,
  isEmbed,
  bottomContainerStyle,
  isResultsPage = false,
}: Props) => {
  const { z } = useTranslation();

  const pageTitle = [
    z({ en: 'Pension Type:', cy: 'Math o Bensiwn:' }),
    stepData[step](z).pageTitle,
    '-',
    z({ en: 'MoneyHelper Tools', cy: 'Teclynnau HelpwrArian' }),
  ].join(' ');

  const title = landingText(z).pageHeading;

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      pageTitle={pageTitle}
      headingLevel={step === 'landing' ? 'h1' : 'h4'}
      noMargin={true}
      mainClassName="my-8"
      className="pt-8 pb-0 mb-4"
    >
      {children}
      <Container className={`${bottomContainerStyle ?? 'mt-8'}`}>
        <PensionTypeBottomContent />
        {isResultsPage && (
          <>
            <div className="lg:max-w-[840px]">
              <ToolFeedback
                surveyIds={{
                  production: {
                    en: 'informizely-embed-ujqnyilh',
                    cy: 'informizely-embed-uljyrlhlk',
                  },
                  development: {
                    en: 'informizely-embed-fjguluwfj',
                    cy: 'informizely-embed-zjiieufr',
                  },
                }}
              />
            </div>
            <div className="lg:max-w-[840px] flex flex-col md:flex-row justify-between pt-6 border-t border-slate-400">
              <SocialShareTool
                url={z({
                  en: 'https://www.moneyhelper.org.uk/pension-type',
                  cy: 'https://www.moneyhelper.org.uk/math-o-bensiwn',
                })}
                title={z({
                  en: 'Share this tool',
                  cy: 'Rhannwch yr offeryn hwn',
                })}
                subject={z({
                  en: 'Find out your pension type',
                  cy: 'Darganfyddwch y math o bensiwn sydd gennych',
                })}
                emailBodyText={z({
                  en: 'Use MoneyHelper’s free tool to check if you have a defined contribution or defined benefit pension.',
                  cy: 'Defnyddiwch declyn am ddim HelpwrArian i wirio a oes gennych bensiwn cyfraniadau wedi’u diffinio neu bensiwn buddion wedi’u diffinio.',
                })}
                xTitle={z({
                  en: 'Find out your pension type – use MoneyHelper’s free tool to check if you have a defined contribution or defined benefit pension.',
                  cy: 'Darganfyddwch y math o bensiwn sydd gennych – defnyddiwch declyn am ddim HelpwrArian i wirio a oes gennych bensiwn cyfraniadau wedi’u diffinio neu bensiwn buddion wedi’u diffinio.',
                })}
              />
            </div>
          </>
        )}
      </Container>
    </ToolPageLayout>
  );
};

const Landing = ({ lang, isEmbed }: LandingProps) => (
  <PensionType step={'landing'} isEmbed={isEmbed} bottomContainerStyle="mb-0">
    <LandingPage lang={lang} isEmbed={isEmbed} />
  </PensionType>
);

export default Landing;

export const getServerSidePropsDefault: GetServerSideProps = async ({
  params,
  query,
}) => {
  const lang = params?.language;
  const isEmbed = !!query?.isEmbedded;
  const urlPath = getToolPath(DataPath.PensionType);
  const filter = pageFilter(query, urlPath, isEmbed);
  const saveddata = filter.getDataFromQuery();
  const currentQuestion = query.question as string;
  const currentStep = Number(
    currentQuestion?.substring(currentQuestion.lastIndexOf('-') + 1),
  );
  const links = getToolLinks(saveddata, filter, currentStep, false);

  return {
    props: {
      storedData: saveddata,
      data: JSON.stringify(saveddata) || '',
      currentStep: currentStep,
      dataPath: DataPath.PensionType,
      lang: lang,
      links: links,
      isEmbed: isEmbed,
    },
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    publicRuntimeConfig: { ENVIRONMENT },
  } = getConfig();

  if (ENVIRONMENT === 'production') {
    const lang = context.params?.language || 'en';
    return {
      redirect: {
        destination: `https://www.moneyhelper.org.uk/${lang}/pensions-and-retirement/pension-wise/find-out-your-pension-type`,
        permanent: true,
      },
    };
  }

  return getServerSidePropsDefault(context);
};
