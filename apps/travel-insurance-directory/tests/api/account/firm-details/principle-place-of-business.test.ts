jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: <T>(handler: T) => handler,
}));

jest.mock('lib/api/createFormHandler', () => ({
  createFormHandler: jest.fn(() => jest.fn()),
}));

jest.mock(
  'data/pages/account/firm-details/principle-place-of-business',
  () => ({
    principlePlaceOfBusinessPage: {
      currentRoute: '/current',
      nextStep: '/next',
    },
    addressLineOneField: {},
    townField: {},
    countryField: {},
    postcodeField: {},
  }),
);

describe('principle-place-of-business handler', () => {
  it('should import without errors', async () => {
    const mod = await import(
      'pages/api/account/firm-details/principle-place-of-business'
    );

    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
