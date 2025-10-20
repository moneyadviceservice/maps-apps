export const setupCommonMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  globalThis.fetch = jest.fn();
  console.error = jest.fn();
  process.env.MHPD_PENSION_DATA_SERVICE = 'http://test-url.com';
};
