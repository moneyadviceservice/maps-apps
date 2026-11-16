import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

export type RegistrationFlows = 'user' | 'firm' | 'scenario' | 'save';

type Props = {
  heading: string;
  category: string;
  toolStep: string;
  stepName: string;
  toolName?: string;
  categoryLevels?: string[];
  currentFlow?: RegistrationFlows;
};

export const generateAnalyticsData = ({
  heading,
  category,
  toolStep,
  stepName,
  toolName = 'Travel Insurance Directory',
  categoryLevels = ['Everyday Money', 'Insurance'],
  currentFlow,
}: Props): AnalyticsData => {
  return {
    page: {
      pageName: `${toolName.toLowerCase().replaceAll(' ', '-')}--${category
        .toLowerCase()
        .replaceAll(' ', '-')}-${
        currentFlow ? currentFlow?.toLowerCase() + '-' : ''
      }${stepName.toLowerCase().replaceAll(' ', '-')}`,
      pageTitle: `${category} - ${heading} -- ${toolName}`,
      categoryLevels: categoryLevels,
      site: 'moneyhelper',
      pageType: 'tool page',
    },
    tool: {
      toolCategory: category,
      toolName: `${toolName}: ${category}${
        currentFlow ? ' - ' + currentFlow : ''
      }`,
      toolStep: toolStep,
      stepName: heading,
    },
  };
};
