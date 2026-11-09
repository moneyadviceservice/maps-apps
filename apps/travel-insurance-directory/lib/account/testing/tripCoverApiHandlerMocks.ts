jest.mock('lib/firms/updateFirm', () => ({
  updateFirm: jest.fn(),
}));

jest.mock('lib/account/tripCover/shared/resolveAccountFirmById', () => ({
  resolveAccountFirmById: jest.fn(),
}));

jest.mock('utils/api/respond/respond');

jest.mock(
  'lib/accountAuth/withAccountSession',
  () =>
    require('lib/account/testing/accountApiHandlerTestHelpers')
      .accountSessionHandlerPassthrough,
);
