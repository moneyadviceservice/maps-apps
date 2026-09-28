import { handleAboutYouAction } from './handleAboutYouAction';

jest.mock('lib/session/aboutYouSession', () => ({
  saveAboutYouToSession: jest.fn().mockResolvedValue(undefined),
}));

describe('handleAboutYouAction', () => {
  const sessionId = 'session123';
  const validBody = {
    day: '10',
    month: '09',
    year: '1986',
    sex: 'male',
    retireAge: '65',
  };

  it('redirects to your income when continue is valid', async () => {
    const result = await handleAboutYouAction({
      action: 'continue',
      language: 'en',
      sessionId,
      body: validBody,
    });

    expect(result.valid).toBe(true);
    expect(result.redirectPath).toBe('/en/your-income?sessionId=session123');
  });

  it('redirects back to about you with error when continue is invalid', async () => {
    const result = await handleAboutYouAction({
      action: 'continue',
      language: 'en',
      sessionId,
      body: { ...validBody, day: '31', month: '02', year: '1960' },
    });

    expect(result.valid).toBe(false);
    expect(result.redirectPath).toContain('/en/about-you');
    expect(result.redirectPath).toContain('error=true');
  });

  it('redirects to save when the save action is used', async () => {
    const result = await handleAboutYouAction({
      action: 'save',
      language: 'en',
      sessionId,
      body: validBody,
    });

    expect(result.valid).toBe(true);
    expect(result.redirectPath).toBe('/en/save?sessionId=session123');
  });
});
