import { DataPath, UrlPath } from 'types';

import { getToolPath } from './getToolPath';

describe('getToolPath', () => {
  it('should return correct path for MidLifeMot', () => {
    const path = DataPath.MidLifeMot;
    expect(getToolPath(path)).toEqual(`/${UrlPath.MidLifeMot}/`);
  });

  it('should return correct path for CreditOptions', () => {
    const path = DataPath.CreditOptions;
    expect(getToolPath(path)).toEqual(`/${UrlPath.CreditOptions}/`);
  });

  it('should return correct path for PensionType', () => {
    const path = DataPath.PensionType;
    expect(getToolPath(path)).toEqual(`/${UrlPath.PensionType}/`);
  });

  it('should return correct path for BabyMoneyTimeline', () => {
    const path = DataPath.BabyMoneyTimeline;
    expect(getToolPath(path)).toEqual(`/${UrlPath.BabyMoneyTimeline}/`);
  });

  it('should return correct path for WorkplacePensionCalculator', () => {
    const path = DataPath.WorkplacePensionCalculator;
    expect(getToolPath(path)).toEqual(
      `/${UrlPath.WorkplacePensionCalculator}/`,
    );
  });

  it('should return an empty string for unknown path', () => {
    const path = 'UnknownPath' as DataPath;
    expect(getToolPath(path)).toEqual('');
  });
});
