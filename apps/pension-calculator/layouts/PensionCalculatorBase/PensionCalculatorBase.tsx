import { ReactNode } from 'react';

import { journeyCopy } from 'data/journey';
import {
  pensionCalculatorAppTitle,
  pensionCalculatorPageTitle,
} from 'data/pageTitle';

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
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const title = pensionCalculatorAppTitle(z);
  const isJourneyPage = Boolean(backHref);

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
          <div className="max-w-[770px]">
            <BackLink href={backHref}>{journeyCopy(z).back}</BackLink>
            <div className="mt-8 space-y-6">
              <div>
                {sectionLabel && (
                  <Paragraph className="mb-8 text-gray-800">
                    {sectionLabel}
                  </Paragraph>
                )}
                <Heading level="h1" className="text-blue-700">
                  {pageHeading}
                </Heading>
                {intro && <Paragraph className="mt-4">{intro}</Paragraph>}
              </div>
              {children}
            </div>
          </div>
        ) : (
          <>
            {showHeading && <Heading level="h1">{pageHeading}</Heading>}
            {children}
          </>
        )}
      </Container>
    </ToolPageLayout>
  );
};
