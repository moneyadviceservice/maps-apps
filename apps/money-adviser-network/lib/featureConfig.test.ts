import { getConfigurationSetting } from './featureConfig';

jest.mock('@azure/app-configuration', () => {
  return {
    AppConfigurationClient: jest.fn().mockImplementation(() => {
      return {
        getConfigurationSetting: jest.fn().mockResolvedValue({
          value: '15',
        }),
      };
    }),
  };
});
describe('Azure app config', () => {
  it('should get the correct values from the azure config when key matches', () => {
    const loginExpire = getConfigurationSetting('man-login-expire');
    loginExpire.then((value) => {
      expect(value).toBe('15');
    });
  });
});
