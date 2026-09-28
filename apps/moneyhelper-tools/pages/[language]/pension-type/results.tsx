import { PensionTypeAnalytics } from 'components/Analytics/PensionTypeAnalytics';
import { data } from 'data/form-content/results/pension-type';
import { Condition } from 'types';

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

const matchesConditions = (
  conditions: Condition[] | undefined,
  conditionGroups: Condition[][] | undefined,
  conditionOperator: 'and' | 'or' | undefined,
  storedData: DataFromQuery,
) => {
  if (conditionGroups) {
    return conditionGroups.some((group) => checkCondition(group, storedData));
  }
  if (!conditions) return true;
  return conditionOperator === 'or'
    ? checkSomeCondition(conditions, storedData)
    : checkCondition(conditions, storedData);
};

const PensionTypeResult = ({ storedData, isEmbed, links }: Props) => {
  const { z } = useTranslation();

  const result =
    data.results.find((entry) =>
      matchesConditions(
        entry.conditions,
        entry.conditionGroups,
        entry.conditionOperator,
        storedData,
      ),
    ) ?? data.results[data.results.length - 1];

  return (
    <PensionType step={6} isEmbed={isEmbed} isResultsPage={true}>
      <PensionTypeAnalytics currentStep={6} formData={storedData}>
        <Results
          heading={z(result.title)}
          mainContent={<>{z(result.content)}</>}
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
