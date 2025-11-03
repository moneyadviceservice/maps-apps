import { ReactNode, useState } from 'react';

import Head from 'next/head';

import { twMerge } from 'tailwind-merge';

import { Breadcrumb, Crumb } from '@maps-react/common/components/Breadcrumb';
import { Heading, Level } from '@maps-react/common/components/Heading';
import { Footer } from '@maps-react/core/components/Footer';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { Header } from '@maps-react/core/components/Header';
import {
  PhaseBanner,
  PhaseType,
} from '@maps-react/core/components/PhaseBanner';
import type { Layout } from '@maps-react/form/components/GridStepContainer/GridStepContainer';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Contact } from '@maps-react/vendor/components/Contact';
import { CookieConsent } from '@maps-react/vendor/components/CookieConsent';

export type ToolPageLayoutProps = {
  title?: string;
  titleTag?: 'default' | 'span';
  breadcrumbs?: Crumb[];
  children: ReactNode;
  tags?: ReactNode;
  className?: string;
  mainClassName?: string;
  pageTitle?: string;
  phase?: PhaseType;
  phaseFeedbackLink?: string;
  noMargin?: boolean;
  headingClassName?: string;
  headingLevel?: Level;
  showContactUs?: boolean;
  topInfoSection?: ReactNode;
  layout?: Layout;
};

export const ToolPageLayout = ({
  title,
  titleTag,
  breadcrumbs,
  children,
  tags,
  className = '',
  mainClassName,
  pageTitle,
  phase,
  phaseFeedbackLink,
  noMargin = false,
  headingClassName,
  headingLevel,
  showContactUs = false,
  topInfoSection,
  layout = 'default',
}: ToolPageLayoutProps) => {
  const { z } = useTranslation();
  pageTitle =
    pageTitle ??
    [
      title,
      '-',
      z({ en: 'MoneyHelper Tools', cy: 'Teclynnau HelpwrArian' }),
    ].join(' ');

  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(false);

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        {tags}
      </Head>

      <div
        id="main-content"
        data-testid="main-content"
        aria-hidden={isCookieConsentOpen}
        className="flex flex-col h-screen"
      >
        <Header layout={layout} />

        {breadcrumbs && <Breadcrumb crumbs={breadcrumbs} />}

        {phase && <PhaseBanner phase={phase} link={phaseFeedbackLink} />}

        {topInfoSection}

        {title &&
          (layout === 'grid' ? (
            <GridContainer className={twMerge('container-auto', className)}>
              <div className="col-span-12 pt-6 md:col-span-8">
                {titleTag === 'span' ? (
                  <span
                    data-testid="toolpage-span-title"
                    className="text-xl font-bold text-left text-blue-700 md:text-2xl"
                  >
                    {title}
                  </span>
                ) : (
                  <Heading
                    color={twMerge(
                      'text-blue-700 text-left max-w-[840px]',
                      headingClassName,
                    )}
                    data-testid="toolpage-h1-title"
                    level={headingLevel ?? 'h1'}
                  >
                    {title}
                  </Heading>
                )}
              </div>
            </GridContainer>
          ) : titleTag === 'span' ? (
            <div className={twMerge('container-auto pt-6', className)}>
              <span
                data-testid="toolpage-span-title"
                className="text-xl font-bold text-left text-blue-700 md:text-2xl"
              >
                {title}
              </span>
            </div>
          ) : (
            <div className={twMerge('container-auto py-8 mb-4', className)}>
              <Heading
                color={twMerge(
                  'text-blue-700 text-left lg:max-w-[840px]',
                  headingClassName,
                )}
                data-testid="toolpage-h1-title"
                level={headingLevel ?? 'h1'}
              >
                {title}
              </Heading>
            </div>
          ))}

        <main
          id="main"
          data-testid="main"
          className={twMerge(
            noMargin ? 'my-2' : 'my-8 md:my-16',
            'flex-grow',
            mainClassName,
          )}
        >
          {children}
        </main>

        {showContactUs && <Contact />}

        <Footer className="mt-8" layout={layout} />
      </div>

      <CookieConsent isOpen={setIsCookieConsentOpen} />
    </div>
  );
};
