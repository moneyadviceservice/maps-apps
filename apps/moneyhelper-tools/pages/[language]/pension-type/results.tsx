import { ReactElement } from 'react';

import { PensionTypeAnalytics } from 'components/Analytics/PensionTypeAnalytics';
import { data } from 'data/form-content/results/pension-type';

import { Results } from '@maps-react/form/components/Results';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import {
  checkCondition,
  checkSomeCondition,
} from '@maps-react/utils/checkCondition';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { getServerSidePropsDefault, PensionType } from '.';

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
    if (
      !conditions ||
      (anyFlag
        ? checkSomeCondition(conditions, storedData)
        : checkCondition(conditions, storedData))
    ) {
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
    if (
      !conditions ||
      (anyFlag
        ? checkSomeCondition(conditions, storedData)
        : checkCondition(conditions, storedData))
    ) {
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
          mainContentContainerClass={`max-w-[840px] ${
            !isEmbed && '-mb-12'
          } my-8`}
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
