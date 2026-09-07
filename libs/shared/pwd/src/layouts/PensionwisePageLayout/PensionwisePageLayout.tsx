import { ReactNode } from 'react';

import { H1, H5 } from '@maps-react/common/components/Heading';
import { Hero } from '@maps-react/common/components/Hero';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { PhaseType } from '@maps-react/core/components/PhaseBanner';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { CustomWebChatLink } from '@maps-react/vendor/components/CustomWebChatLink';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import {
  JsonRichText,
  mapJsonRichText,
} from '@maps-react/vendor/utils/RenderRichText';

import { SaveReturnLink } from '../../components/SaveReturnLink';

export type DetailModel = {
  id: number;
  title?: string;
  content?: JsonRichText;
};

export type DetailPageProps = {
  data: DetailModel;
};

export type SharedContentModel = {
  helpAndSupportTitle: string;
  helpAndSupportText: JsonRichText;
};

export type QuestionModel = {
  id: number;
  taskId?: string;
  footerForm?: boolean;
  questionCounter?: string;
  title: string;
  definition?: JsonRichText;
  options: string[];
  moreInfoLabel?: string;
  moreInfoText?: JsonRichText;
  errorText: string;
};

export type QuestionPageProps = {
  data: QuestionModel;
};

export type PensionWisePageProps = {
  pageTitle?: string;
  sharedContent: SharedContentModel;
  heroTitle?: string;
  heroContent?: JsonRichText;
  route: {
    back?: string;
    backText?: string;
    next?: string;
    nextText?: string;
    saveReturnLink?: boolean;
    query: Record<string, string>;
    app: string;
    section?: string;
  };
  isToolNameH1?: boolean;
  nonce?: string;
};

export type PensionwisePageLayoutProps = {
  children: ReactNode;
  useInformizely?: boolean;
};

export const PensionwisePageLayout = ({
  children,
  nonce,
  pageTitle,
  heroTitle,
  heroContent,
  sharedContent,
  route: {
    back,
    backText,
    next,
    nextText,
    saveReturnLink = false,
    query,
    app,
    section,
  },
  isToolNameH1 = false,
  useInformizely = false,
}: PensionwisePageLayoutProps & PensionWisePageProps) => {
  const { z } = useTranslation();
  const { language, error, returning, ...newQuery } = query;

  const title = z({
    en: 'Get your pension guidance',
    cy: 'Cael eich arweiniad pensiwn',
  });

  return (
    <ToolPageLayout
      pageTitle={
        error
          ? z({
              en: 'Error, please review your answer',
              cy: 'Gwall, adolygwch eich ateb',
            })
          : pageTitle ?? title
      }
      phase={PhaseType.BETA}
      phaseFeedbackLink={z({
        en: 'https://forms.office.com/e/5k3b567kJ5',
        cy: 'https://forms.office.com/e/7FwWzGLHjv',
      })}
      noMargin={!!heroTitle && !!heroContent}
    >
      {!!heroTitle && !!heroContent && (
        <Hero title={heroTitle}>{mapJsonRichText(heroContent.json)}</Hero>
      )}

      <Container className="text-base">
        {!heroTitle && !isToolNameH1 && (
          <Paragraph
            data-testid="page-title"
            className="mb-8 text-xl font-bold text-blue-700 md:mb-16 md:text-2xl"
          >
            {title}
          </Paragraph>
        )}
        {isToolNameH1 && (
          <H1
            data-testid="page-title"
            className="mb-8 md:mb-16"
            color="text-blue-700"
          >
            {title}
          </H1>
        )}
        <div className="lg:flex lg:flex-row">
          <div className="lg:flex-grow lg:mr-16 xl:mr-28 2xl:mr-96">
            <div
              className={`mb-8 flex ${
                back ? 'justify-between' : 'justify-end lg:hidden'
              }`}
            >
              {back && (
                <Link
                  href={{
                    pathname: back.startsWith('http')
                      ? back
                      : `/${language}/${app}${back}`,
                    query: newQuery,
                    hash: section ?? '',
                  }}
                  data-testid="back"
                  color="text-blue-500"
                >
                  <Icon type={IconType.CHEVRON_LEFT} />{' '}
                  {backText ??
                    z({
                      en: 'Back',
                      cy: 'Yn ôl',
                    })}
                </Link>
              )}
              {sharedContent && (
                <Link
                  href="#help"
                  data-testid="help-and-support"
                  color="text-blue-500"
                  className="lg:hidden"
                >
                  {sharedContent.helpAndSupportTitle}
                  <Icon type={IconType.ARROW_UP} className="rotate-[180deg]" />
                </Link>
              )}
            </div>

            {children}

            {next && (
              <div className="mt-6 md:flex">
                <Link
                  href={{
                    pathname: `/${language}/${app}${next}`,
                    query: newQuery,
                  }}
                  data-testid="continue"
                  asButtonVariant="primary"
                  className="flex-grow md:flex-grow-0 !justify-center px-5 w-full md:w-auto"
                >
                  {nextText ??
                    z({
                      en: 'Continue',
                      cy: 'Parhau',
                    })}
                </Link>
                {saveReturnLink && (
                  <SaveReturnLink
                    href={{
                      pathname: `/${language}/${process.env.appUrl}/save`,
                      query: newQuery,
                    }}
                    className="w-full mt-6 ml-0 md:ml-4 md:mt-0 md:w-auto"
                  />
                )}
              </div>
            )}
          </div>

          <div className="mt-16 lg:w-[300px] lg:mt-0 lg:flex-shrink-0">
            {sharedContent && (
              <InformationCallout className="md:sticky md:top-4">
                <div className="p-6" id="help">
                  <H5 className="mb-4">{sharedContent.helpAndSupportTitle}</H5>
                  {sharedContent.helpAndSupportText?.json && (
                    <RichTextAem className="text-sm">
                      {mapJsonRichText(sharedContent.helpAndSupportText.json)}
                    </RichTextAem>
                  )}
                  <CustomWebChatLink />
                </div>
              </InformationCallout>
            )}
          </div>
        </div>
      </Container>
      {useInformizely && (
        <>
          <InformizelyGetToolName nonce={nonce} />
          <InformizelyDevScript
            siteId={process.env.NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID ?? ''}
            nonce={nonce}
          />
        </>
      )}

      <DocumentScripts
        nonce={nonce}
        useGoogleTagManager={
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ||
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging'
        }
        useGenesysLiveChat={false}
        useAdobeAnalytics={false}
      />
    </ToolPageLayout>
  );
};
