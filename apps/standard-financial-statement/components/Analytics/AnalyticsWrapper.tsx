import { PropsWithChildren } from 'react';

import { Analytics } from '@maps-react/core/components/Analytics';

export type StandardFinancialStatementStep = number | string;

type Props = {
  analyticsData: Record<string, unknown>;
};

export const AnalyticsWrapper = ({
  analyticsData,
  children,
}: Props & PropsWithChildren) => {
  return (
    <Analytics
      analyticsData={analyticsData}
      currentStep={0}
      formData={{}}
      lastStep={0}
      errors={[]}
      trackDefaults={{
        toolCompletion: false,
        toolStartRestart: false,
        errorMessage: false,
        pageLoad: true,
        emptyToolCompletion: false,
      }}
    >
      {children}
    </Analytics>
  );
};
