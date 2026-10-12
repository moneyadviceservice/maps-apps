import MainResults from 'components/Results/MainResults/MainResults';
import { PAGE_NAME_PREFIX, PAGE_TITLE_PREFIX } from 'lib/constants';
import { RetirementGuidanceIndex } from 'lib/types';

import { Results } from '@maps-react/form/components/Results';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ToolLinks } from '@maps-react/utils/getToolLinks/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter/pageFilter';

import { RetirementGuidance } from '.';
import { useRetirementGuidanceAnalytics } from '../../lib/hooks';

type Props = {
  storedData: DataFromQuery;
  currentStep: number;
  isEmbed: boolean;
  links: ToolLinks;
};
const ResultsPage = ({ storedData, currentStep, isEmbed, links }: Props) => {
  const { t } = useTranslation();

  useRetirementGuidanceAnalytics({
    pageName: `${PAGE_NAME_PREFIX}results`,
    pageTitle: `${PAGE_TITLE_PREFIX}Results`,
    toolStep: '14',
    stepName: 'Results',
    fireToolStart: false,
    fireToolComplete: true,
  });
  return (
    <RetirementGuidance
      step={currentStep as RetirementGuidanceIndex}
      isEmbed={isEmbed}
    >
      <Results
        heading={t('results.heading')}
        headingClassName="secondary"
        mainContentClass="pt-0 pb-0"
        mainContentContainerClass="mb-0"
        mainContent={
          <MainResults
            changeAnswerLink={links.result.backLink}
            data={storedData}
          />
        }
        backLink={links.result.backLink}
        layout="grid"
      />
    </RetirementGuidance>
  );
};

export default ResultsPage;

export { getServerSidePropsDefault as getServerSideProps } from '.';
