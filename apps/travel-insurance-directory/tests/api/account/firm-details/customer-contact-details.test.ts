jest.mock('lib/accountAuth/withAccountSession', () => ({
  withAccountSession: <T>(handler: T) => handler,
}));

jest.mock('lib/api/createFormHandler', () => ({
  createFormHandler: jest.fn(() => jest.fn()),
}));

jest.mock('data/pages/account/firm-details/customer-contact-details', () => ({
  customerContactDetailsPage: {
    currentRoute: '/current',
    nextStep: '/next',
  },
  emailField: {},
  telephoneNumberField: {},
  websiteAddressField: {},
}));

describe('customer-contact-details handler', () => {
  it('should load module without errors', async () => {
    const mod = await import(
      'pages/api/account/firm-details/customer-contact-details'
    );

    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
