import { ComponentProps } from 'react';

import { config } from 'data/civic-cookies';

import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

type Props = ComponentProps<typeof ToolPageLayout>;

export const TravelInsuranceDirectoryPageLayout = (props: Props) => (
  <ToolPageLayout cookieConfig={config} showTrustpilot {...props} />
);
