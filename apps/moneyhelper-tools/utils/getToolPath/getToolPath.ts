import { DataPath, UrlPath } from 'types';

const toolPath = (urlPath: UrlPath) => {
  return `/${urlPath}/`;
};

export const getToolPath = (dataPath: DataPath) => {
  switch (dataPath) {
    case DataPath.MidLifeMot: {
      return toolPath(UrlPath.MidLifeMot);
    }
    case DataPath.CreditRejection: {
      return toolPath(UrlPath.CreditRejection);
    }
    case DataPath.CreditOptions: {
      return toolPath(UrlPath.CreditOptions);
    }
    case DataPath.PensionType: {
      return toolPath(UrlPath.PensionType);
    }
    default: {
      return '';
    }
  }
};
