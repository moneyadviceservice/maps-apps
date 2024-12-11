import { ReactNode, useState } from 'react';

import Head from 'next/head';

import { twMerge } from 'tailwind-merge';

import { Breadcrumb, Crumb } from '@maps-react/common/components/Breadcrumb';
import { Heading, Level } from '@maps-react/common/components/Heading';
import { Footer } from '@maps-react/core/components/Footer';
import { Header } from '@maps-react/core/components/Header';
import {
  PhaseBanner,
  PhaseType,
} from '@maps-react/core/components/PhaseBanner';
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
        <Header />

        {breadcrumbs && <Breadcrumb crumbs={breadcrumbs} />}

        {phase && <PhaseBanner phase={phase} link={phaseFeedbackLink} />}

        {topInfoSection}

        {title &&
          (titleTag === 'span' ? (
            <div className={twMerge('container-auto pt-6', className)}>
              <span
                data-testid="toolpage-span-title"
                className="text-2xl font-bold text-blue-800 "
              >
                {title}
              </span>
            </div>
          ) : (
            <div className={twMerge('container-auto py-8 mb-4', className)}>
              <Heading
                color={twMerge(
                  'text-blue-800 lg:max-w-[840px]',
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
            !noMargin ? 'my-8 md:my-16' : 'my-2',
            'flex-grow',
            mainClassName,
          )}
        >
          {children}
        </main>

        {showContactUs && <Contact />}

        <Footer />
      </div>

      <CookieConsent isOpen={setIsCookieConsentOpen} />
    </div>
  );
};
