import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getServerSidePropsDefault, MidLifeMot } from '.';
import { MidLifeMotResults } from '../../../components/MidlifeMotResults';

type Props = {
  storedData: DataFromQuery;
  links: ToolLinks;
  isEmbed: boolean;
};

export const Results = ({ storedData, isEmbed, links }: Props) => {
  const { addPage } = useAnalytics();
  const { z } = useTranslation();

  const resultsAnalyticsData = (event: string) => {
    return {
      page: {
        pageName: 'midlife-mot--results',
        pageTitle: z({
          en: 'Personalised report',
          cy: 'Adroddiad personol',
        }),
      },
      tool: {
        toolName: 'Midlife MOT',
        toolStep: 21,
        stepName: 'Results',
      },
      event,
    };
  };

  addPage([
    resultsAnalyticsData('pageLoadReact'),
    resultsAnalyticsData('toolCompletion'),
  ]);

  return (
    <MidLifeMot step="result" isEmbed={isEmbed}>
      <MidLifeMotResults
        storedData={storedData}
        backLink={links.result.backLink}
        firstStep={links.result.firstStep}
      />
    </MidLifeMot>
  );
};

export default Results;

export const getServerSideProps = getServerSidePropsDefault;
