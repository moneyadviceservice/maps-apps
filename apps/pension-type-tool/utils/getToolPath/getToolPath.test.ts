import { DataPath, UrlPath } from 'types';

import { getToolPath } from './getToolPath';

describe('getToolPath', () => {
  it('should return correct path for PensionType', () => {
    const path = DataPath.PensionType;
    expect(getToolPath(path)).toEqual(`/${UrlPath.PensionType}/`);
  });

  it('should return an empty string for unknown path', () => {
    const path = 'UnknownPath' as DataPath;
    expect(getToolPath(path)).toEqual('');
  });
});
