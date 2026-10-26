import { handleRetirementIncomeAction } from './handleRetirementIncomeAction';

describe('handleRetirementIncomeAction', () => {
  it('keeps a continue on the retirement income page', () => {
    expect(
      handleRetirementIncomeAction({
        action: 'continue',
        language: 'en',
        sessionId: 'abc',
      }),
    ).toEqual({
      valid: true,
      redirectPath: '/en/retirement-income?sessionId=abc',
    });
  });

  it('sends save to the save page', () => {
    expect(
      handleRetirementIncomeAction({
        action: 'save',
        language: 'en',
        sessionId: 'abc',
      }).redirectPath,
    ).toBe('/en/save?sessionId=abc');
  });
});
