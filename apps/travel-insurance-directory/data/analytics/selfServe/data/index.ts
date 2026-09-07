import { generateAnalyticsData } from 'lib/analytics/generateAnalyticsData';

const defaultFlow = 'account' as const;
const tripCoverFlow = `${defaultFlow}:trip-cover` as const;
const firmDetailsFlow = `${defaultFlow}:firm-details` as const;

const categoryDisplayNames: Record<keyof typeof analyticsData, string> = {
  selfServe: 'Self Serve',
};

export const analyticsData = {
  selfServe: {
    tripCover: {
      1: {
        currentFlow: tripCoverFlow,
      },
      2: {
        currentFlow: tripCoverFlow,
      },
      3: {
        currentFlow: tripCoverFlow,
      },
      4: {
        currentFlow: tripCoverFlow,
      },
      5: {
        currentFlow: tripCoverFlow,
      },
      6: {
        currentFlow: tripCoverFlow,
      },
      7: {
        currentFlow: tripCoverFlow,
      },
      8: {
        currentFlow: tripCoverFlow,
      },
      9: {
        currentFlow: tripCoverFlow,
      },
    },
    firmDetails: {
      1: {
        currentFlow: firmDetailsFlow,
      },
      2: {
        currentFlow: firmDetailsFlow,
      },
      3: {
        currentFlow: firmDetailsFlow,
      },
      4: {
        currentFlow: firmDetailsFlow,
      },
    },
    landing: {
      1: {
        currentFlow: defaultFlow,
      },
    },
    login: {
      0: {
        currentFlow: defaultFlow,
      },
    },
  },
} as const;

export type SelfServeFlow = keyof typeof analyticsData.selfServe;

export type TripCoverStep = keyof typeof analyticsData.selfServe.tripCover;

export const getAnalyticsStepData = <
  Category extends keyof typeof analyticsData,
  Flow extends keyof (typeof analyticsData)[Category],
>(
  category: Category,
  flowName: Flow,
  step: keyof (typeof analyticsData)[Category][Flow],
  heading: string,
) => {
  const staticData = analyticsData[category][flowName][step];

  const analyticsStepData = {
    ...staticData,
    toolStep: String(step),
    heading,
    stepName: heading,
    category: categoryDisplayNames[category],
  };

  return generateAnalyticsData(analyticsStepData);
};
