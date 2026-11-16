import { ReactNode } from 'react';

import { ErrorSummaryProvider } from 'context/ErrorSummaryProvider';
import { TravelInsuranceDirectory } from 'layouts/TravelInsuranceDirectory';
import { AnalyticsConfig } from 'layouts/TravelInsuranceDirectory/TravelInsuranceDirectory';
import { FormErrorsState } from 'types/register';

import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

interface SelfServeFormLayoutProps {
  title: string;
  backLink: string;
  initialErrors: FormErrorsState | null;
  isRadio?: boolean;
  fieldLabels?: Record<string, string>;
  errorMessageOverrides?: Record<string, string | Record<string, string>>;
  analyticsData?: AnalyticsData;
  analyticsConfig?: AnalyticsConfig;
  children: ReactNode;
}

export const SelfServeFormLayout = ({
  title,
  backLink,
  initialErrors = {},
  isRadio = false,
  fieldLabels,
  errorMessageOverrides,
  analyticsData,
  analyticsConfig,
  children,
}: SelfServeFormLayoutProps) => {
  return (
    <ErrorSummaryProvider
      initialErrors={initialErrors}
      isRadio={isRadio}
      fieldLabels={fieldLabels}
      errorMessageOverrides={errorMessageOverrides}
    >
      {({ errorSummarySection }) => (
        <TravelInsuranceDirectory
          browserTitle={`Self Serve - ${title}`}
          backLink={backLink}
          heading={title}
          showLanguageSwitcher={false}
          analyticsData={analyticsData}
          errorSummarySection={errorSummarySection}
          analyticsConfig={analyticsConfig}
        >
          {children}
        </TravelInsuranceDirectory>
      )}
    </ErrorSummaryProvider>
  );
};
