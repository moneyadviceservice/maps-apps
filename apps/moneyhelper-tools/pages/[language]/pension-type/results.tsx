import { ReactNode } from 'react';
import { PensionType, getServerSidePropsDefault } from '.';
import { Results } from 'components/Results';
import { useTranslation } from '@maps-digital/shared/hooks';
import { checkCondition } from 'utils/ResultCheckCondition';
import { useAnalytics } from 'hooks/useAnalytics';
import { DataFromQuery } from 'utils/pageFilter';
import { ToolLinks } from 'utils/getToolLinks';
import { data } from 'data/form-content/results/pension-type';
import { pensionTypeAnalytics as analyticsData } from 'data/form-content/analytics';

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

const MainContent = ({ storedData }: DataFromQuery): ReactNode => {
  const { z } = useTranslation();

  const { content } = data;
  const { defaultContent, conditionalContent } = content;

  for (const { content, conditions, conditionOperator } of conditionalContent) {
    const anyFlag = conditionOperator === 'or';
    if (!conditions || checkCondition(conditions, storedData, anyFlag)) {
      return z(content);
    }
  }

  return z(defaultContent);
};

const PensionTypeResult = ({ storedData, isEmbed, links }: Props) => {
  const { z } = useTranslation();
  const { addPage } = useAnalytics();

  const { pageName, pageTitle, toolName } = analyticsData;

  addPage([
    {
      page: {
        pageName: pageName,
        pageTitle: pageTitle,
      },
      tool: {
        toolName: toolName,
        toolStep: 'result',
        stepName: 'Results',
      },
      event: 'pageLoadReact',
    },
    {
      page: {
        pageName: pageName,
        pageTitle: pageTitle,
      },
      tool: {
        toolName: toolName,
        toolStep: 'result',
        stepName: 'Results',
      },
      event: 'toolCompletion',
    },
  ]);

  const heading = getHeading(storedData, z);

  return (
    <PensionType step="result" isEmbed={isEmbed}>
      <Results
        heading={heading}
        mainContent={<MainContent storedData={storedData} />}
        mainContentContainerClass={'max-w-[840px] -mb-12'}
        mainContentClass={'pt-8'}
        backLink={links.result.backLink}
        displayActionButtons={false}
      />
    </PensionType>
  );
};

export default PensionTypeResult;

export const getServerSideProps = getServerSidePropsDefault;
