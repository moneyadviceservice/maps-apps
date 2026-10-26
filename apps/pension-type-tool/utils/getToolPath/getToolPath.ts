import { DataPath, UrlPath } from 'types';

const toolPath = (urlPath: UrlPath) => {
  return `/${urlPath}/`;
};

export const getToolPath = (dataPath: DataPath) => {
  if (dataPath === DataPath.PensionType) {
    return toolPath(UrlPath.PensionType);
  }
  return '';
};
