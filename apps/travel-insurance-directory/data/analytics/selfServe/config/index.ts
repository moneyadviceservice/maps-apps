const trackEvents = {
  pageLoad: true,
  toolStartRestart: true,
  toolCompletion: true,
  errorMessage: true,
  emptyToolCompletion: true,
} as const;

export const analyticsConfig = {
  selfServe: {
    login: { trackEvents },
    landing: { trackEvents: { ...trackEvents, toolStartRestart: false } },
    tripCover: { trackEvents, lastStep: '9' },
    firmDetails: { trackEvents, lastStep: '4' },
  },
} as const;

export type SelfServeFlow = keyof typeof analyticsConfig.selfServe;

export const getSelfServeConfig = (flowName: SelfServeFlow) => {
  return analyticsConfig.selfServe[flowName];
};
