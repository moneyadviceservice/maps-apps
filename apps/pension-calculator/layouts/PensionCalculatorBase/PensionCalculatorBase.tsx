import { ReactNode } from 'react';

import { Heading } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

const appTitle = (z: ReturnType<typeof useTranslation>['z']) => {
  return z({
    en: 'Pension Calculator',
    cy: 'Cyfrifiannell Pensiwn',
  });
};

const pageTitle = (
  pageHeading: string,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return `${pageHeading} - ${appTitle(z)}`;
};

type Props = {
  pageHeading: string;
  showHeading?: boolean;
  showLanguageSwitcher?: boolean;
  topInfoSection?: ReactNode;
  children: ReactNode;
};

export const PensionCalculatorBase = ({
  pageHeading,
  showHeading = true,
  showLanguageSwitcher = true,
  topInfoSection,
  children,
}: Readonly<Props>) => {
  const { z } = useTranslation();
  const title = appTitle(z);

  return (
    <ToolPageLayout
      pageTitle={pageTitle(pageHeading, z)}
      title={showHeading ? title : undefined}
      titleTag={'span'}
      noMargin={true}
      mainClassName="text-gray-800 mt-1"
      className="pt-8 mb-4"
      showLanguageSwitcher={showLanguageSwitcher}
      topInfoSection={topInfoSection}
    >
      <Container className="space-y-10">
        {showHeading && <Heading level="h1">{pageHeading}</Heading>}
        {children}
      </Container>
    </ToolPageLayout>
  );
};
