import { DataPath, UrlPath } from 'types';

const toolPath = (urlPath: UrlPath) => {
  return `/${urlPath}/`;
};

export const getToolPath = (dataPath: DataPath) => {
  switch (dataPath) {
    case DataPath.MidLifeMot: {
      return toolPath(UrlPath.MidLifeMot);
    }
    case DataPath.CreditOptions: {
      return toolPath(UrlPath.CreditOptions);
    }
    case DataPath.PensionType: {
      return toolPath(UrlPath.PensionType);
    }
    case DataPath.BabyCostCalculator: {
      return toolPath(UrlPath.BabyCostCalculator);
    }
    case DataPath.WorkplacePensionCalculator: {
      return toolPath(UrlPath.WorkplacePensionCalculator);
    }
    case DataPath.BabyMoneyTimeline: {
      return toolPath(UrlPath.BabyMoneyTimeline);
    }
    default: {
      return '';
    }
  }
};
