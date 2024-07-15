import { ReactNode, useState } from 'react';
import Head from 'next/head';
import { twMerge } from 'tailwind-merge';
import { Breadcrumb, Crumb } from '../../components/Breadcrumb';
import { Heading, Level } from '../../components/Heading';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Contact } from '../../components/Contact';
import { PhaseBanner, PhaseType } from '../../components/PhaseBanner';
import { CookieConsent } from '../../components/CookieConsent';

import { useTranslation } from '@maps-digital/shared/hooks';

export type ToolPageLayoutProps = {
  title?: string;
  titleTag?: 'default' | 'span';
  breadcrumbs?: Crumb[];
  children: ReactNode;
  tags?: ReactNode;
  className?: string;
  pageTitle?: string;
  phase?: PhaseType;
  phaseFeedbackLink?: string;
  noMargin?: boolean;
  headingClassName?: string;
  headingLevel?: Level;
  showContactUs?: boolean;
};

export const ToolPageLayout = ({
  title,
  titleTag,
  breadcrumbs,
  children,
  tags,
  className = '',
  pageTitle,
  phase,
  phaseFeedbackLink,
  noMargin = false,
  headingClassName,
  headingLevel,
  showContactUs = false,
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

        {title &&
          (titleTag === 'span' ? (
            <div className={twMerge('container-auto pt-6', className)}>
              <span
                data-testid="toolpage-span-title"
                className="text-2xl text-blue-800 font-bold "
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
          className={twMerge(!noMargin ? 'my-8 md:my-16' : 'my-2', 'flex-grow')}
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
