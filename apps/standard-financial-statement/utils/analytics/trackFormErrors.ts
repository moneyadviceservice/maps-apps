import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

export const trackFormErrors = (
  addEvent: (data: AnalyticsData) => void,
  errors: Record<string, string[]>,
) => {
  addEvent({
    event: 'errorMessage',
    eventInfo: {
      toolName: '',
      toolStep: '',
      stepName: '',
      errorDetails: Object.entries(errors).map(([field, messages]) => ({
        reactCompType: 'FormField',
        reactCompName: field,
        errorMessage: messages[0].split(' - ').pop()?.trim(),
      })),
    },
  } as AnalyticsData);
};
