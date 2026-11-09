import { handleRetirementIncomeAction } from './handleRetirementIncomeAction';

describe('handleRetirementIncomeAction', () => {
  it('sends continue to check your answers', () => {
    expect(
      handleRetirementIncomeAction({
        action: 'continue',
        language: 'en',
        sessionId: 'abc',
      }),
    ).toEqual({
      valid: true,
      redirectPath: '/en/check-your-answers?sessionId=abc',
    });
  });

  it('sends save to the save page', () => {
    expect(
      handleRetirementIncomeAction({
        action: 'save',
        language: 'en',
        sessionId: 'abc',
      }).redirectPath,
    ).toBe(
      '/en/save?returnTo=%2Fen%2Fretirement-income%3FsessionId%3Dabc&sessionId=abc',
    );
  });
});
