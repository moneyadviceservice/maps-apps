import { ReactElement } from 'react';
import { PensionType, getServerSidePropsDefault } from '.';
import { Results } from 'components/Results';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { checkCondition } from 'utils/ResultCheckCondition';
import { DataFromQuery } from 'utils/pageFilter';
import { ToolLinks } from 'utils/getToolLinks';
import { data } from 'data/form-content/results/pension-type';
import { PensionTypeAnalytics } from 'components/Analytics/PensionTypeAnalytics';

type Props = {
  storedData: DataFromQuery;
  links: ToolLinks;
  isEmbed: boolean;
};

const getHeading = (
  storedData: DataFromQuery,
  z: ReturnType<typeof useTranslation>['z'],
): string => {
  const { headings } = data;
  const { defaultTitle, conditionalTitles } = headings;

  for (const { title, conditions, conditionOperator } of conditionalTitles) {
    const anyFlag = conditionOperator === 'or';
    if (!conditions || checkCondition(conditions, storedData, anyFlag)) {
      return z(title);
    }
  }

  return z(defaultTitle);
};

const MainContent = ({ storedData }: DataFromQuery): ReactElement => {
  const { z } = useTranslation();

  const { content } = data;
  const { defaultContent, conditionalContent } = content;

  for (const { content, conditions, conditionOperator } of conditionalContent) {
    const anyFlag = conditionOperator === 'or';
    if (!conditions || checkCondition(conditions, storedData, anyFlag)) {
      return <>{z(content)}</>;
    }
  }

  return <>{z(defaultContent)}</>;
};

const PensionTypeResult = ({ storedData, isEmbed, links }: Props) => {
  const { z } = useTranslation();

  const heading = getHeading(storedData, z);

  return (
    <PensionType step={6} isEmbed={isEmbed}>
      <PensionTypeAnalytics currentStep={6} formData={storedData}>
        <Results
          heading={heading}
          mainContent={<MainContent storedData={storedData} />}
          mainContentContainerClass={`max-w-[840px] ${!isEmbed && '-mb-12'}`}
          mainContentClass={''}
          backLink={links.result.backLink}
          displayActionButtons={false}
        />
      </PensionTypeAnalytics>
    </PensionType>
  );
};

export default PensionTypeResult;

export const getServerSideProps = getServerSidePropsDefault;
