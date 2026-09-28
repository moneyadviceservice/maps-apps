import { ReactElement } from 'react';

import { PensionTypeAnalytics } from 'components/Analytics/PensionTypeAnalytics';
import { data } from 'data/form-content/results/pension-type';
import { Condition, TranslationGroup } from 'types';
import { twMerge } from 'tailwind-merge';

import { Results } from '@maps-react/form/components/Results';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import {
  checkCondition,
  checkSomeCondition,
} from '@maps-react/utils/checkCondition';
import { ToolLinks } from '@maps-react/utils/getToolLinks';
import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { PensionType } from '.';

type Props = {
  storedData: DataFromQuery;
  links: ToolLinks;
  isEmbed: boolean;
};

const matchesContentConditions = (
  conditions: Condition[] | undefined,
  conditionGroups: Condition[][] | undefined,
  conditionOperator: 'and' | 'or' | undefined,
  storedData: DataFromQuery,
) => {
  if (conditionGroups) {
    return conditionGroups.some((group) => checkCondition(group, storedData));
  }

  if (!conditions) {
    return true;
  }

  return conditionOperator === 'or'
    ? checkSomeCondition(conditions, storedData)
    : checkCondition(conditions, storedData);
};

const getResult = (storedData: DataFromQuery) => {
  for (const result of data.results) {
    if (
      matchesContentConditions(
        result.conditions,
        result.conditionGroups,
        result.conditionOperator,
        storedData,
      )
    ) {
      return result;
    }
  }

  const fallbackResult = data.results.at(-1);

  if (!fallbackResult) {
    throw new Error('Pension type results content is empty');
  }

  return fallbackResult;
};

const MainContent = ({
  content,
}: {
  content: TranslationGroup;
}): ReactElement<any> => {
  const { z } = useTranslation();
  return <>{z(content)}</>;
};

const PensionTypeResult = ({ storedData, isEmbed, links }: Props) => {
  const { z } = useTranslation();
  const result = getResult(storedData);

  return (
    <PensionType step={6} isEmbed={isEmbed} isResultsPage={true}>
      <PensionTypeAnalytics currentStep={6} formData={storedData}>
        <Results
          heading={z(result.title)}
          mainContent={<MainContent content={result.content} />}
          mainContentContainerClass={twMerge(
            'max-w-[840px]',
            'my-8',
            !isEmbed && '-mb-8',
          )}
          mainContentClass={''}
          backLink={links.result.backLink}
          displayActionButtons={false}
        />
      </PensionTypeAnalytics>
    </PensionType>
  );
};

export default PensionTypeResult;

export { getServerSidePropsDefault as getServerSideProps } from '.';
