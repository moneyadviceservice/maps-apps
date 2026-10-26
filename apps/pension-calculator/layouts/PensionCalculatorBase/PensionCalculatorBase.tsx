import { ReactNode } from 'react';

import { journeyCopy } from 'data/journey';
import {
  pensionCalculatorAppTitle,
  pensionCalculatorPageTitle,
} from 'data/pageTitle';
import { twMerge } from 'tailwind-merge';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = {
  pageHeading: string;
  showHeading?: boolean;
  showLanguageSwitcher?: boolean;
  topInfoSection?: ReactNode;
  hasError?: boolean;
  backHref?: string;
  sectionLabel?: string;
  intro?: ReactNode;
  maxContentWidth?: string;
  headerContainerClasses?: string;
  children: ReactNode;
};

export const PensionCalculatorBase = ({
  pageHeading,
  showHeading = true,
  showLanguageSwitcher = true,
  topInfoSection,
  hasError = false,
  backHref,
  sectionLabel,
  intro,
  maxContentWidth = 'max-w-[770px]',
  headerContainerClasses = 'max-w-full',
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const title = pensionCalculatorAppTitle(z);
  const isJourneyPage = Boolean(backHref);

  const headingText = (
    <Heading level="h1" className="text-blue-700">
      {pageHeading}
    </Heading>
  );
  const heading = <div className={headerContainerClasses}>{headingText}</div>;

  const childrenSection = maxContentWidth ? (
    <div className={maxContentWidth}>{children}</div>
  ) : (
    children
  );

  return (
    <ToolPageLayout
      pageTitle={pensionCalculatorPageTitle(pageHeading, z, hasError)}
      title={isJourneyPage || showHeading ? title : undefined}
      titleTag={'span'}
      noMargin={true}
      mainClassName="text-gray-800 mt-1"
      className="pt-8 mb-4"
      showLanguageSwitcher={showLanguageSwitcher}
      topInfoSection={topInfoSection}
    >
      <Container className="space-y-10">
        {isJourneyPage && backHref ? (
          <>
            <BackLink href={backHref}>{journeyCopy(z).back}</BackLink>
            <div className="mt-8 space-y-6">
              <div>
                {sectionLabel && (
                  <Paragraph className="mb-8 text-gray-800">
                    {sectionLabel}
                  </Paragraph>
                )}
                {heading}
                {intro && (
                  <Paragraph className={twMerge('mt-4', maxContentWidth)}>
                    {intro}
                  </Paragraph>
                )}
              </div>
              {childrenSection}
            </div>
          </>
        ) : (
          <>
            {showHeading && heading}
            {childrenSection}
          </>
        )}
      </Container>
    </ToolPageLayout>
  );
};
